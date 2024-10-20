import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Importiere das Refresh-Icon
import Logo from './assets/Logo_Header.png'; // Beispiel: Pfad zu deinem Logo-Bild

const Header = () => {
  const handleRefresh = () => {
    window.location.reload(); // Seite neu laden
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#002147' }}> {/* Hochschulblau als Hintergrund */}
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={Logo} alt="Logo" style={{ width: '70px', marginRight: '20px' }} />
        </Box>

        {/* Mittig positionierter Text */}
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            component="div" 
            style={{ 
              fontFamily: 'Poppins, Roboto, sans-serif', 
              fontWeight: 500, 
              color: '#FFFFFF' 
            }}
          >
            Parking App
          </Typography>
        </Box>

        {/* Button zum Aktualisieren */}
        <IconButton color="inherit" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
