import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';

const NurseDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nurse Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Health Records</Typography>
            {/* Add health records component here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming Checkups</Typography>
            {/* Add checkups component here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NurseDashboard; 