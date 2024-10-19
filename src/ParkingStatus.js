import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore-Datenbank importieren
import { collection, getDocs } from 'firebase/firestore';
import { Container, Typography, Card, Grid, Box, Button, Divider } from '@mui/material'; // Divider hinzugefügt
import { Link, useNavigate } from 'react-router-dom'; // Link und useNavigate importieren

const headerColor = '#002244'; // Farbe des Headers (angepasst auf die gewünschte Farbe)

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

  // Funktion zur Ermittlung des Parkplatzstatus und der entsprechenden Farbe
  const getParkingStatusColor = (spot) => {
    if (spot.isOccupied && spot.isReserved) {
      return { status: 'Belegt - Reserviert', color: '#9e9e9e' }; // Grau für Belegt und Reserviert
    } else if (!spot.isOccupied && spot.isReserved) {
      return { status: 'Frei - Reserviert', color: '#64b5f6' }; // Blau für Frei und Reserviert
    } else if (spot.isOccupied && !spot.isReserved) {
      return { status: 'Belegt - Nicht Reserviert', color: '#e57373' }; // Rot für Belegt und Nicht Reserviert
    } else {
      return { status: 'Frei - Nicht Reserviert', color: '#64b5f6' }; // Blau für Frei und Nicht Reserviert
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 60 }}> {/* Mehr Abstand zur Überschrift */}
      {/* Schwarze Überschrift */}
      <Typography 
        variant="h4" 
        gutterBottom 
        style={{
          textAlign: 'center', 
          fontWeight: 600, 
          color: '#000', 
          fontSize: '2rem',
          letterSpacing: '0.03em',
          marginBottom: '40px'  // Mehr Abstand zwischen Überschrift und Karten
        }}
      >
        Parkplatzstatus
      </Typography>

      {/* Anzeige der Parkplätze */}
      <Grid container spacing={2}>
        {parkingSpots.length > 0 ? (
          parkingSpots.map((spot) => {
            const { status, color } = getParkingStatusColor(spot);
            return (
              <Grid item xs={12} key={spot.id}>
                <Card
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    border: `1px solid ${headerColor}`, // Farblich angepasster Rand der Karten
                    borderRadius: '5px',
                    cursor: 'pointer',
                    padding: '0',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {/* Farbiger Abschnitt für Parkplatznummer */}
                  <Box 
                    style={{ 
                      backgroundColor: color, 
                      width: '60px', 
                      height: '100%', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      padding: '20px 0',
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      style={{ 
                        fontWeight: 'bold', 
                        color: '#fff',
                        textAlign: 'center',
                      }}
                    >
                      {spot.id} {/* Nur die Parkplatznummer */}
                    </Typography>
                  </Box>

                  {/* Textbereich mit Status */}
                  <Box 
                    style={{ 
                      flexGrow: 1, 
                      padding: '20px', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center'
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      style={{ 
                        fontWeight: 'bold', 
                        color: '#000', 
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>
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

      {/* Horizontale Linie zwischen den Karten und den Buttons */}
      <Divider style={{ margin: '40px 0', backgroundColor: headerColor }} /> {/* Divider mit Header-Farbe */}

      {/* Kompakte Buttons mit einer einheitlichen Farbgebung */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to="/qr-scanner"
          variant="outlined"
          style={{ 
            width: '80%',  // Weniger breite Buttons
            maxWidth: '200px',  // Maximalbreite kleiner
            padding: '8px 0',  // Kompaktere Höhe
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, // Farblich angepasster Rand
            color: '#000', 
            backgroundColor: '#fff', 
          }}
        >
          QR Code scannen
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate('/map')}
          style={{ 
            width: '80%', 
            maxWidth: '200px', 
            padding: '8px 0', 
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, // Farblich angepasster Rand
            color: '#000', 
            backgroundColor: '#fff', 
          }}
        >
          Maps
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate('/zip-code')}
          style={{ 
            width: '80%', 
            maxWidth: '200px', 
            padding: '8px 0', 
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, // Farblich angepasster Rand
            color: '#000', 
            backgroundColor: '#fff', 
          }}
        >
          Fahrgemeinschaften
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => navigate('/statistics')}
          style={{ 
            width: '80%', 
            maxWidth: '200px', 
            padding: '8px 0', 
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, // Farblich angepasster Rand
            color: '#000', 
            backgroundColor: '#fff', 
          }}
        >
          Statistiken
        </Button>
      </Box>
    </Container>
  );
};

export default ParkingStatus;

