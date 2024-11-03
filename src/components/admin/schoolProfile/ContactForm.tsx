import React from 'react';
import {
  Grid,
  TextField
} from '@mui/material';
import { ContactInfo } from '../../../types/school';

interface ContactFormProps {
  data: ContactInfo | undefined;
  onChange: (data: ContactInfo) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ data = {
  primaryPhone: '',
  alternatePhone: '',
  primaryEmail: '',
  alternateEmail: '',
  emergencyContact: ''
}, onChange }) => {
  const handleChange = (field: keyof ContactInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Primary Phone"
          value={data.primaryPhone}
          onChange={handleChange('primaryPhone')}
          required
          placeholder="e.g., +1-234-567-8900"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Alternate Phone"
          value={data.alternatePhone}
          onChange={handleChange('alternatePhone')}
          placeholder="e.g., +1-234-567-8900"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Primary Email"
          type="email"
          value={data.primaryEmail}
          onChange={handleChange('primaryEmail')}
          required
          placeholder="e.g., contact@school.com"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Alternate Email"
          type="email"
          value={data.alternateEmail}
          onChange={handleChange('alternateEmail')}
          placeholder="e.g., info@school.com"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Emergency Contact"
          value={data.emergencyContact}
          onChange={handleChange('emergencyContact')}
          required
          multiline
          rows={2}
          placeholder="Emergency contact details including name, role, and phone number"
        />
      </Grid>
    </Grid>
  );
};

export default ContactForm; 