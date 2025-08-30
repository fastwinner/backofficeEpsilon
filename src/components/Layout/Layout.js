import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Receipt as TransactionIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import EpsilonLogo from '../EpsilonLogo';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
  { text: 'Professeurs', icon: <SchoolIcon />, path: '/teachers' },
  { text: 'Transactions', icon: <TransactionIcon />, path: '/transactions' },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (e) => {
    setProfileAnchorEl(e.currentTarget);
  };
  const handleProfileMenuClose = () => setProfileAnchorEl(null);
  const handleLogout = () => {
    try {
      localStorage.removeItem('eps_auth_token');
      sessionStorage.removeItem('eps_auth_token');
    } finally {
      handleProfileMenuClose();
      navigate('/login');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', borderRight: '1px solid #E5E7EB' }}>
      <Box sx={{ p: 4, borderBottom: '1px solid #F3F4F6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
          <EpsilonLogo width={120} height={36} showText={true} />
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Back Office
          </Typography>
        </Box>
      </Box>
      
      <List sx={{ flex: 1, px: 3, py: 4 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                py: 2,
                px: 2,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.Mui-selected': {
                  bgcolor: '#0B442D',
                  color: 'white',
                  boxShadow: '0 1px 3px 0 rgba(11, 68, 45, 0.3)',
                  '&:hover': {
                    bgcolor: '#051F16',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: desktopOpen ? `${drawerWidth}px` : 0 },
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', px: 3 }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <EpsilonLogo width={80} height={24} compact={true} />
            <Typography variant="h5" sx={{ color: '#111827', fontWeight: 700, fontSize: '1.25rem' }}>
              Epsilon Admin
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            sx={{ 
              display: { xs: 'none', sm: 'inline-flex' }, 
              mr: 1,
              color: '#6B7280',
              '&:hover': { bgcolor: '#F3F4F6', color: '#374151' }
            }}
            onClick={handleDesktopToggle}
            aria-label={desktopOpen ? 'Réduire la barre latérale' : 'Afficher la barre latérale'}
          >
            {desktopOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <IconButton
            sx={{
              color: '#6B7280',
              '&:hover': { bgcolor: '#F3F4F6', color: '#374151' }
            }}
            aria-label="Profil"
            aria-controls={profileAnchorEl ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(profileAnchorEl) || undefined}
            onClick={handleProfileMenuOpen}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open={desktopOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
