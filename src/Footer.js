import React from 'react';
import { Box, Typography } from '@mui/material'; // Material-UI-Komponenten
const headerColor = '#002244'; // Gleiche Farbe wie der Header

const Footer = () => {
  return (
    <Box 
      component="footer"
      sx={{ 
        backgroundColor: headerColor, // Hintergrundfarbe des Footers ist die gleiche wie die des Headers
        padding: '10px 0',
        marginTop: '40px',
        textAlign: 'center',
        color: '#fff', // Textfarbe weiß für Kontrast
        position: 'relative',
        width: '100%'
      }}
    >
      <Typography variant="body2">
        Idp Projekt - Nachhaltige Mobilität
      </Typography>
    </Box>
  );
};

export default Footer;
