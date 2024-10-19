import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Importiere das Refresh-Icon
import Logo from './assets/Logo_Header.png'; // Beispiel: Pfad zu deinem Logo-Bild

const Header = () => {
  const handleRefresh = () => {
    window.location.reload(); // Seite neu laden
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#002147' }}> {/* Hochschulblau als Hintergrund */}
      <Toolbar>
        {/* Logo */}
        <img src={Logo} alt="Logo" style={{ width: '60px', marginRight: '20px' }} />
        
        {/* Text oder App-Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Parking App
        </Typography>

        {/* Button zum Aktualisieren */}
        <IconButton color="inherit" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
