import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from './dashboards/TeacherDashboard';
import NurseDashboard from './dashboards/NurseDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import Navigation from './layout/Navigation';
import { ROLES } from '../constants/roles';

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();

  const getDashboardByRole = () => {
    switch (userRole) {
      case ROLES.TEACHER:
        return <TeacherDashboard />;
      case ROLES.NURSE:
        return <NurseDashboard />;
      case ROLES.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Unauthorized</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {getDashboardByRole()}
      </Box>
    </Box>
  );
};

export default Dashboard; 