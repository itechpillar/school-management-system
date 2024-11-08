import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Container,
  Box,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import RoleSelectionDialog from './RoleSelectionDialog';
import { UserRole } from '../../types';
import { auth } from '../../config/firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { login, googleSignIn, completeRegistration, tempUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in: ' + (err as Error).message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { newUser } = await googleSignIn();
      if (newUser) {
        setShowRoleDialog(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to sign in with Google: ' + (err as Error).message);
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    try {
      if (tempUser) {
        await completeRegistration(tempUser, role);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to complete registration: ' + (err as Error).message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          School Management System
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
        </Box>
      </Paper>

      <RoleSelectionDialog
        open={showRoleDialog}
        onClose={() => {
          setShowRoleDialog(false);
          if (tempUser) {
            auth.signOut();
          }
        }}
        onSelect={handleRoleSelect}
      />
    </Container>
  );
};

export default Login; 