import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Typography, Card, Grid, Box, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'; 
import { Link, useNavigate } from 'react-router-dom';

const headerColor = '#002244';

const ParkingStatus = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null); // Zustand für ausgewählte Parkplätze
  const navigate = useNavigate();

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
      return { status: 'Belegt - Reserviert', color: '#9e9e9e' };
    } else if (!spot.isOccupied && spot.isReserved) {
      return { status: 'Frei - Reserviert', color: '#64b5f6' };
    } else if (spot.isOccupied && !spot.isReserved) {
      return { status: 'Belegt - Nicht Reserviert', color: '#e57373' };
    } else {
      return { status: 'Frei - Nicht Reserviert', color: '#64b5f6' };
    }
  };

  // Funktion zum Öffnen des Dialogs mit Parkplatzdetails
  const handleOpenDetails = (spot) => {
    setSelectedSpot(spot);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 60 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        style={{
          textAlign: 'center', 
          fontWeight: 600, 
          color: '#000', 
          fontSize: '2rem',
          letterSpacing: '0.03em',
          marginBottom: '40px'
        }}
      >
        Parkplatzstatus
      </Typography>

      {/* Scrollbare Liste von Parkplätzen */}
      <Box style={{ maxHeight: '280px', overflowY: 'auto', padding: '10px', border: `1px solid ${headerColor}`, borderRadius: '10px' }}>
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
                      border: `1px solid ${headerColor}`,
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
                    onClick={() => handleOpenDetails(spot)} // Karte wird anklickbar
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
                        {spot.id}
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
      </Box>

      {/* Dialog für Parkplatzdetails */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Parkplatzdetails</DialogTitle>
        <DialogContent>
          {selectedSpot ? (
            <>
              <Typography variant="body1">Parkplatz-ID: {selectedSpot.id}</Typography>
              <Typography variant="body1">
                Status: {selectedSpot.isReserved ? 'Reserviert' : 'Nicht reserviert'}
              </Typography>
              <Typography variant="body1">
                Kennzeichen: {selectedSpot.licensePlate || 'Nicht verfügbar'}
              </Typography>
              <Typography variant="body1">
                Reserviert seit: {selectedSpot.reservedTimestamp || 'Nicht verfügbar'}
              </Typography>
            </>
          ) : (
            <Typography variant="body1">Details nicht verfügbar</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Schließen</Button>
        </DialogActions>
      </Dialog>

      <Divider style={{ margin: '40px 0', backgroundColor: headerColor }} />

      {/* Kompakte Buttons mit einer einheitlichen Farbgebung */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Button
          component={Link}
          to="/qr-scanner"
          variant="outlined"
          style={{ 
            width: '80%', 
            maxWidth: '200px', 
            padding: '8px 0', 
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, 
            color: '#000', 
            backgroundColor: '#fff',
          }}
        >
          QR Code scannen
        </Button>

        <Button
          component="a"
          href="https://freeonlinesurveys.com/s/DjkS69pz"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          style={{ 
            width: '80%', 
            maxWidth: '200px', 
            padding: '8px 0', 
            borderRadius: '8px',
            fontWeight: 'bold', 
            borderColor: headerColor, 
            color: '#000', 
            backgroundColor: '#fff',
          }}
        >
          Umfrage
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
            borderColor: headerColor, 
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
            borderColor: headerColor, 
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

