import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore-Datenbank importieren
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Typography, Card, CardContent, Grid, Box, IconButton, Button, Paper } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material'; // Chat-Icon importiert
import { useAuth } from './auth'; // Zum Abrufen des eingeloggten Nutzers

const FindCarpoolPartners = () => {
  const [carpoolPartners, setCarpoolPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null); // Der ausgewählte Carpool-Partner
  const { currentUser } = useAuth(); // Holen der E-Mail des aktuellen Nutzers

  useEffect(() => {
    const fetchCarpoolPartners = async () => {
      if (currentUser) {
        try {
          // Lade den aktuellen Benutzer aus der "users"-Collection
          const userSnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', currentUser.uid)));
          
          if (!userSnapshot.empty) { // Prüfen, ob Benutzerdaten existieren
            const currentUserData = userSnapshot.docs[0]?.data();

            if (currentUserData?.zipCode) { // Sicherstellen, dass die Postleitzahl existiert
              // Benutzer mit derselben Postleitzahl aus der "users"-Collection finden
              const querySnapshot = await getDocs(query(collection(db, 'users'), where('zipCode', '==', currentUserData.zipCode)));
              const usersInArea = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              setCarpoolPartners(usersInArea); // Setze die Benutzer, die Fahrgemeinschaften wollen
            } else {
              console.error("Benutzer hat keine Postleitzahl.");
            }
          } else {
            console.error("Benutzerdaten konnten nicht geladen werden.");
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Fahrgemeinschaften: ", error);
        }
      }
    };

    fetchCarpoolPartners();
  }, [currentUser]);

  // Funktion zum Öffnen der Karte mit Partnerinformationen
  const handleClickOpen = (partner) => {
    setSelectedPartner(partner); // Den Partner speichern, um ihn in der Karte anzuzeigen
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 50 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
          Fahrgemeinschaften in Ihrer Nähe
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Finden Sie Personen mit einer ähnlichen Postleitzahl.
        </Typography>
      </Box>

      {/* Scrollbarer Bereich für Carpool-Partner */}
      <Box style={{ maxHeight: '450px', overflowY: 'auto', marginTop: '20px' }}> {/* Scroll-Container */}
        <Grid container spacing={3} style={{ maxHeight: '450px' }}> {/* Begrenzung auf 3 Karten */}
          {carpoolPartners.map((partner) => (
            <Grid item xs={12} sm={6} key={partner.id}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {partner.username} {/* Benutzername aus Firebase */}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Postleitzahl: {partner.zipCode} {/* Postleitzahl aus Firebase */}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {/* IconButton für das Chat-Symbol */}
                    <IconButton
                      color="primary"
                      onClick={() => handleClickOpen(partner)} // Öffne die Karte mit Partnerinformationen
                    >
                      <ChatIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Karte, die erscheint, wenn ein Partner ausgewählt wird */}
      {selectedPartner && (
        <Paper
          style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Vereinbare eine Fahrt mit {selectedPartner.username}
          </Typography>
          <Typography variant="body1">
            Sende eine E-Mail an <strong>{selectedPartner.email}</strong>, um eine Fahrt zu vereinbaren.
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Beispielnachricht: "Hallo {selectedPartner.username}, ich würde gerne eine Fahrgemeinschaft organisieren."
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="secondary" onClick={() => setSelectedPartner(null)}>
              Schließen
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default FindCarpoolPartners;

