import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ROLES } from '../../constants/roles';
import { User, UserRole } from '../../types';

interface FormData {
  email: string;
  username: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    username: '',
    role: 'teacher',
    firstName: '',
    lastName: ''
  });
  const [usernameError, setUsernameError] = useState<string>('');
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const isUsernameUnique = async (username: string, userId?: string): Promise<boolean> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return true;
    
    // If editing existing user, allow same username for same user
    if (userId) {
      return querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === userId;
    }
    
    return false;
  };

  const generateUsernameRecommendations = (
    firstName: string,
    lastName: string,
    existingUsername?: string
  ): string[] => {
    const recommendations: string[] = [];
    const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    
    recommendations.push(base);
    recommendations.push(`${firstName.toLowerCase()}.${lastName.toLowerCase()}`);
    recommendations.push(`${firstName.toLowerCase()}_${lastName.toLowerCase()}`);
    recommendations.push(`${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`);
    recommendations.push(`${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`);
    
    return recommendations.filter(rec => rec !== existingUsername);
  };

  const handleUsernameChange = async (username: string) => {
    setIsCheckingUsername(true);
    setUsernameError('');
    
    try {
      const isUnique = await isUsernameUnique(username, selectedUser?.id);
      if (!isUnique) {
        setUsernameError('Username already exists');
        const recommendations = generateUsernameRecommendations(
          formData.firstName,
          formData.lastName,
          username
        );
        setUsernameError(`Username already exists. Try: ${recommendations.join(', ')}`);
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'username') {
      await handleUsernameChange(value);
    }

    // Generate username when first and last name are entered
    if ((name === 'firstName' || name === 'lastName') && !formData.username) {
      const firstName = name === 'firstName' ? value : formData.firstName;
      const lastName = name === 'lastName' ? value : formData.lastName;
      
      if (firstName && lastName) {
        const suggestedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
        setFormData(prev => ({
          ...prev,
          username: suggestedUsername
        }));
        await handleUsernameChange(suggestedUsername);
      }
    }
  };

  const handleOpenDialog = (user: User | null = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email || '',
        username: user.username,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        username: '',
        role: 'teacher',
        firstName: '',
        lastName: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleRoleChange = (e: SelectChangeEvent<UserRole>) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value as UserRole
    }));
  };

  const handleSubmit = async () => {
    try {
      const userData: DocumentData = {
        email: formData.email,
        username: formData.username,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        updatedAt: new Date().toISOString()
      };

      if (selectedUser) {
        // Update existing user
        const userRef = doc(db, 'users', selectedUser.id);
        await updateDoc(userRef, userData);
      } else {
        // Create new user
        await addDoc(collection(db, 'users'), {
          ...userData,
          createdAt: new Date().toISOString()
        });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return 'Super Admin';
      case ROLES.ADMIN:
        return 'Admin';
      case ROLES.TEACHER:
        return 'Teacher';
      case ROLES.NURSE:
        return 'Nurse';
      case ROLES.PARENT:
        return 'Parent';
      case ROLES.STUDENT:
        return 'Student';
      default:
        return role;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom component="div">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
          sx={{ mb: 2 }}
        >
          Add New User
        </Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            error={!!usernameError}
            helperText={usernameError}
            required
          />
          <TextField
            margin="dense"
            name="firstName"
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value={ROLES.SUPER_ADMIN}>Super Admin</MenuItem>
              <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
              <MenuItem value={ROLES.TEACHER}>Teacher</MenuItem>
              <MenuItem value={ROLES.NURSE}>Nurse</MenuItem>
              <MenuItem value={ROLES.PARENT}>Parent</MenuItem>
              <MenuItem value={ROLES.STUDENT}>Student</MenuItem>
            </Select>
          </FormControl>
          {usernameError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {usernameError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!!usernameError || isCheckingUsername}
          >
            {selectedUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 