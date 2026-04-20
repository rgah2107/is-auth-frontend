import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

export function AppLayout({ children, title }) {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo(
    () => [
      { label: 'INICIO', icon: <HomeIcon />, to: '/' },
      { label: 'Cuentas clientes', icon: <PeopleIcon />, to: '/clientes' },
    ],
    []
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Usuario en sesión
        </Typography>
        <Typography variant="h6" fontWeight={800}>
          {username}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to}
            selected={location.pathname === it.to}
            onClick={() => {
              navigate(it.to);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 800 }}>
            {title || 'Innovasoft - Clientes'}
          </Typography>
          <Typography variant="subtitle2" sx={{ mr: 2, opacity: 0.9 }}>
            {username}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

