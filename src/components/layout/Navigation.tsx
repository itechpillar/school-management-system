import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  School,
  Dashboard,
  Assignment,
  LocalHospital,
  People,
  ExitToApp,
  Settings
} from '@mui/icons-material';
import { ROLES } from '../../constants/roles';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  onClick: () => void;
}

const Navigation: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        text: 'Dashboard',
        icon: <Dashboard />,
        onClick: () => navigate('/dashboard')
      }
    ];

    switch (userRole) {
      case ROLES.ADMIN:
        items.push(
          {
            text: 'User Management',
            icon: <People />,
            onClick: () => navigate('/admin/users')
          },
          {
            text: 'Settings',
            icon: <Settings />,
            onClick: () => navigate('/admin/settings')
          }
        );
        break;
      case ROLES.TEACHER:
        items.push(
          {
            text: 'Classes',
            icon: <School />,
            onClick: () => navigate('/teacher/classes')
          },
          {
            text: 'Grades',
            icon: <Assignment />,
            onClick: () => navigate('/teacher/grades')
          }
        );
        break;
      case ROLES.NURSE:
        items.push(
          {
            text: 'Health Records',
            icon: <LocalHospital />,
            onClick: () => navigate('/nurse/records')
          },
          {
            text: 'Checkups',
            icon: <Assignment />,
            onClick: () => navigate('/nurse/checkups')
          }
        );
        break;
    }

    return items;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {getMenuItems().map((item) => (
              <ListItem key={item.text} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation; 