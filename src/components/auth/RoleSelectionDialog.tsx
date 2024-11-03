import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { UserRole } from '../../types';
import { ROLES } from '../../constants/roles';

export interface RoleSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (role: UserRole) => void;
}

export const RoleSelectionDialog: React.FC<RoleSelectionDialogProps> = ({
  open,
  onClose,
  onSelect
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as UserRole);
  };

  const handleSubmit = () => {
    onSelect(selectedRole);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Your Role</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value={ROLES.TEACHER}>Teacher</MenuItem>
            <MenuItem value={ROLES.NURSE}>Nurse</MenuItem>
            <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleSelectionDialog; 