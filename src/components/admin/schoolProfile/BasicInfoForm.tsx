import React from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { BasicSchoolInfo } from '../../../types/school';

interface BasicInfoFormProps {
  data: BasicSchoolInfo | undefined;
  onChange: (data: BasicSchoolInfo) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data = {
  name: '',
  establishedYear: new Date().getFullYear(),
  schoolType: 'private',
  motto: '',
  website: ''
}, onChange }) => {
  const handleTextChange = (field: keyof BasicSchoolInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  const handleSelectChange = (field: keyof BasicSchoolInfo) => (
    e: SelectChangeEvent
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
          label="School Name"
          value={data.name}
          onChange={handleTextChange('name')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Established Year"
          type="number"
          value={data.establishedYear}
          onChange={handleTextChange('establishedYear')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>School Type</InputLabel>
          <Select
            value={data.schoolType}
            label="School Type"
            onChange={handleSelectChange('schoolType')}
            required
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
            <MenuItem value="international">International</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Motto"
          value={data.motto}
          onChange={handleTextChange('motto')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website"
          value={data.website}
          onChange={handleTextChange('website')}
        />
      </Grid>
    </Grid>
  );
};

export default BasicInfoForm; 