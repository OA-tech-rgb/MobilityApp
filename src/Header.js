import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from './auth'; // Richtig importieren
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom'; // useNavigate importieren
import Logo from './assets/Logo_Header.png';

const Header = () => {
  const { currentUser, logout } = useAuth(); // Logout richtig importieren
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Hook für Navigation verwenden

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout(); // Logout aufrufen
    handleClose();
    navigate('/'); // Nach dem Logout zur Login-Seite leiten
  };

  const handleWithdraw = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        zipCode: '', // PLZ zurücksetzen
        willingToCarpool: false, // Bereitschaft zurücksetzen
      });
      handleClose();
      alert('Ihre Postleitzahl und Fahrgemeinschaftsbereitschaft wurden erfolgreich zurückgezogen.');
    } catch (error) {
      console.error('Fehler beim Zurückziehen:', error);
    }
  };

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
              fontWeight: 300, 
              color: '#FFFFFF' 
            }}
          >
        ParkES!
          </Typography>
        </Box>

        {/* Button zum Aktualisieren */}
        <IconButton color="inherit" onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>

        {/* Dropdown-Menü für Benutzeraktionen */}
        <div>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu} // Öffne das Dropdown-Menü
            color="inherit"
          >
            <AccountCircle /> {/* Benutzer-Icon */}
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
            onClose={handleClose} // Schließe Menü
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* Logout-Option */}
            <MenuItem onClick={handleWithdraw}>PLZ und Mitfahrbereitschaft zurückziehen</MenuItem> {/* PLZ und Bereitschaft zurückziehen */}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
