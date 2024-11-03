import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';

const TeacherDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">My Classes</Typography>
            {/* Add class list component here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Grades</Typography>
            {/* Add recent grades component here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard; 