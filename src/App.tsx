import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';
import Dashboard from './components/Dashboard';
import { ROLES } from './constants/roles';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/teacher/*"
            element={
              <RoleRoute allowedRoles={[ROLES.TEACHER]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/nurse/*"
            element={
              <RoleRoute allowedRoles={[ROLES.NURSE]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
