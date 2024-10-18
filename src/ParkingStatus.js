import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore-Datenbank importieren
import { collection, getDocs } from 'firebase/firestore';
import { Container, Typography, Card, CardContent, Grid, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Link und useNavigate importieren

const ParkingStatus = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const navigate = useNavigate(); // useNavigate initialisieren

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
    <Container maxWidth="md" style={{ marginTop: 50 }}>
      {/* Animierte und personalisierte Überschrift */}
      <Typography 
        variant="h4" 
        gutterBottom 
        style={{
          textAlign: 'center', 
          fontWeight: 'bold', 
          color: '#1976d2',
          fontSize: '2.5rem',
          letterSpacing: '0.05em',
          animation: 'fadeIn 1.2s ease-in-out',
        }}
      >
        Parkplatzstatus
      </Typography>

      {/* Anzeige der Parkplätze */}
      <Grid container spacing={3}>
        {parkingSpots.length > 0 ? (
          parkingSpots.map((spot) => {
            const status = getParkingStatus(spot);
            return (
              <Grid item xs={12} sm={4} key={spot.id}>
                <Card
                  style={{
                    backgroundColor: spot.isOccupied ? (spot.isReserved ? '#ffcc80' : '#ff8a80') : '#a5d6a7',
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s', // Smooth Hover Effekt und Schatten
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 'bold', color: '#37474f' }}>
                      Parkplatz {spot.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
                      {status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography variant="body1" style={{ textAlign: 'center', marginTop: 20 }}>
            Keine Parkplätze verfügbar.
          </Typography>
        )}
      </Grid>

      {/* QR-Code scannen, PLZ eingeben und Fahrgemeinschaften Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <Button
          component={Link}
          to="/qr-scanner"
          variant="contained"
          color="primary"
          style={{ marginRight: '10px', borderRadius: '15px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          QR Code scannen
        </Button>

        <Button
  variant="contained"
  color="primary"
  onClick={() => navigate('/map')}  // Button führt zur Kartenansicht
  style={{ borderRadius: '15px', padding: '10px 20px', fontWeight: 'bold' }}
>
  Maps
</Button>


        {/* Fahrgemeinschaften-Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/zip-code')}  // PLZ-Seite aufrufen
          style={{ borderRadius: '15px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          Fahrgemeinschaften
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/statistics')} // Navigation zur Statistik-Seite
          style={{ borderRadius: '15px', padding: '10px 20px', fontWeight: 'bold' }}
        >
          Statistiken
        </Button>
      </Box>
    </Container>
  );
};

export default ParkingStatus;
