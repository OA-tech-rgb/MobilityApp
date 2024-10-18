import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const LandingPage = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkingSpots = async () => {
      const querySnapshot = await getDocs(collection(db, 'parkings'));
      const spots = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setParkingSpots(spots);
    };

    fetchParkingSpots();
  }, []);

  // Funktion zur Ermittlung des Parkplatzstatus
  const getParkingStatus = (spot) => {
    if (spot.isOccupied && spot.isReserved) {
      return 'Belegt - Reserviert';
    } else if (!spot.isOccupied && spot.isReserved) {
      return 'Frei - Reserviert';
    } else if (spot.isOccupied && !spot.isReserved) {
      return 'Belegt - Nicht Reserviert';
    } else {
      return 'Frei - Nicht Reserviert';
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: '#000',  // Schwarzer Hintergrund wie in deinem Beispiel
        color: '#fff',  // Weißer Text für hohen Kontrast
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Hauptüberschrift */}
      <Typography variant="h1" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Willkommen in der Parkplatz-App
      </Typography>

      {/* Untertitel */}
      <Typography variant="h5" style={{ marginBottom: '40px', textAlign: 'center', color: '#ccc' }}>
        Sehen Sie den aktuellen Parkplatzstatus und weitere Funktionen.
      </Typography>

      {/* Parkplatzstatus als Beispiel */}
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
            marginBottom: 5,
          }}
        >
          {parkingSpots.length > 0 ? (
            parkingSpots.map((spot) => (
              <Box
                key={spot.id}
                sx={{
                  backgroundColor: spot.isOccupied ? (spot.isReserved ? '#ffcc80' : '#ff8a80') : '#a5d6a7',
                  padding: 2,
                  borderRadius: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Typography variant="h6">{spot.id}</Typography>
                <Typography>{getParkingStatus(spot)}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="h6">Keine Parkplätze verfügbar</Typography>
          )}
        </Box>
      </Container>

      {/* Call-to-Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to="/qr-scanner"
          sx={{
            backgroundColor: '#00d4ff',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            '&:hover': { backgroundColor: '#00a0d1' },
          }}
        >
          QR Code Scannen
        </Button>

        <Button
          variant="contained"
          component={Link}
          to="/zip-code"
          sx={{
            backgroundColor: '#ff007f',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            '&:hover': { backgroundColor: '#d1006a' },
          }}
        >
          PLZ Eingeben
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate('/statistics')}
          sx={{
            borderColor: '#00ff87',
            color: '#00ff87',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            '&:hover': {
              borderColor: '#00ff87',
              backgroundColor: 'rgba(0, 255, 135, 0.1)',
            },
          }}
        >
          Statistiken
        </Button>
      </Box>
    </div>
  );
};

export default LandingPage;
