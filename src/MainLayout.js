import React from 'react';
import { Container } from '@mui/material';
import Footer from './Footer'; // Importiere den Footer

const MainLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Stellt sicher, dass der gesamte Viewport ausgefüllt ist
      }}
    >
      <Container component="main" sx={{ flexGrow: 1 }}>
        {children} {/* Der Inhalt der Seite */}
      </Container>
      <Footer /> {/* Footer bleibt immer unten */}
    </Box>
  );
};

export default MainLayout;
