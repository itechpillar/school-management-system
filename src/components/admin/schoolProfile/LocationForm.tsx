import React from 'react';
import {
  Grid,
  TextField
} from '@mui/material';
import { LocationInfo } from '../../../types/school';

interface LocationFormProps {
  data: LocationInfo | undefined;
  onChange: (data: LocationInfo) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ data = {
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  coordinates: { latitude: 0, longitude: 0 }
}, onChange }) => {
  const handleChange = (field: keyof Omit<LocationInfo, 'coordinates'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  const handleCoordinateChange = (field: 'latitude' | 'longitude') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const coordinates = {
      latitude: field === 'latitude' ? parseFloat(e.target.value) : (data.coordinates?.latitude || 0),
      longitude: field === 'longitude' ? parseFloat(e.target.value) : (data.coordinates?.longitude || 0)
    };

    onChange({
      ...data,
      coordinates
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          rows={3}
          value={data.address}
          onChange={handleChange('address')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="City"
          value={data.city}
          onChange={handleChange('city')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="State"
          value={data.state}
          onChange={handleChange('state')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Country"
          value={data.country}
          onChange={handleChange('country')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Postal Code"
          value={data.postalCode}
          onChange={handleChange('postalCode')}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Latitude"
          type="number"
          value={data.coordinates?.latitude || 0}
          onChange={handleCoordinateChange('latitude')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Longitude"
          type="number"
          value={data.coordinates?.longitude || 0}
          onChange={handleCoordinateChange('longitude')}
        />
      </Grid>
    </Grid>
  );
};

export default LocationForm; 