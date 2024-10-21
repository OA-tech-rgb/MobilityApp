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
        textAlign: 'center',
        color: '#fff', // Textfarbe weiß für Kontrast
        position: 'sticky', // Sticky sorgt dafür, dass der Footer am unteren Rand bleibt
        bottom: 0, // Am unteren Rand der Seite
        width: '100%',
        mt: 'auto', // Lässt den Footer am Ende erscheinen
      }}
    >
      <Typography variant="body2">
        Idp Projekt - Nachhaltige Mobilität
      </Typography>
    </Box>
  );
};

export default Footer;
