import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const ModernLandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          marginBottom: '30px',
          fontSize: '48px',
        }}
      >
        Introducing Your Parking App
      </Typography>
      <Typography
        variant="h6"
        sx={{
          marginBottom: '40px',
          fontSize: '18px',
        }}
      >
        Simplify your parking experience with real-time data and efficient management.
      </Typography>

      {/* Button zum Scannen eines QR-Codes */}
      <Button
        onClick={() => navigate('/qr-scanner')}
        variant="contained"
        color="primary"
        sx={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#1976d2',
          fontWeight: 'bold',
          fontSize: '18px',
          borderRadius: '30px',
        }}
      >
        Scan QR Code
      </Button>

      {/* Weiterer Button zum Anzeigen von Statistiken */}
      <Button
        onClick={() => navigate('/statistics')}
        variant="contained"
        sx={{
          padding: '10px 20px',
          backgroundColor: '#43a047',
          fontWeight: 'bold',
          fontSize: '18px',
          borderRadius: '30px',
        }}
      >
        View Statistics
      </Button>
    </Box>
  );
};

export default ModernLandingPage;
