import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from './auth'; 
import { useNavigate } from 'react-router-dom'; 
import Logo from './assets/Logo_Header.png';

const Header = () => {
  const { currentUser, logout } = useAuth(); // Logout und aktueller Benutzer
  const [anchorEl, setAnchorEl] = useState(null); // Zustand für Dropdown-Anker
  const navigate = useNavigate(); // Hook für Navigation

  // Öffnen des Dropdown-Menüs
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Schließen des Dropdown-Menüs
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout und Navigation zur Login-Seite
  const handleLogout = async () => {
    await logout(); // Benutzer abmelden
    handleClose();
    navigate('/'); // Zur Login-Seite leiten
  };

  // Aktualisierung der Seite
  const handleRefresh = () => {
    window.location.reload();
  };

  // Navigation zu verschiedenen Seiten
  const handleNavigate = (path) => {
    handleClose();
    navigate(path); // Zu einer bestimmten Route navigieren
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#002147' }}> {/* Hochschulblau */}
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo als Button nur anzeigen, wenn der Benutzer eingeloggt ist */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => handleNavigate('/parking-status')}>
              <img src={Logo} alt="Logo" style={{ width: '70px', marginRight: '20px' }} />
            </IconButton>
          </Box>
        )}

        {/* Mittiger Titel */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            component="div" 
            style={{ 
              fontFamily: 'Poppins, Roboto, sans-serif', 
              fontWeight: 550, 
              color: '#FFFFFF' 
            }}
          >
            ParkES!
          </Typography>
        </Box>

        {/* Button zum Aktualisieren */}
        {currentUser && (
          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        )}

        {/* Benutzerprofil Dropdown-Menü nur anzeigen, wenn der Benutzer eingeloggt ist */}
        {currentUser && (
          <div>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle /> {/* Benutzer-Icon */}
            </IconButton>

            {/* Dropdown-Menü */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                style: {
                  padding: '10px', 
                  borderRadius: '10px', 
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              {/* Navigationsoptionen mit Icons */}
              <MenuItem onClick={() => handleNavigate('/settings')}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Einstellungen" />
              </MenuItem>

              {/* Divider für eine saubere Trennung */}
              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
