import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore-Datenbank importieren
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Typography, Card, CardContent, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material'; // Chat-Icon importiert
import { useAuth } from './auth'; // Zum Abrufen des eingeloggten Nutzers

const FindCarpoolPartners = () => {
  const [carpoolPartners, setCarpoolPartners] = useState([]);
  const [open, setOpen] = useState(false); // Zustand für das Öffnen des Dialogs
  const { currentUser } = useAuth(); // Holen der E-Mail des aktuellen Nutzers
  const [selectedPartner, setSelectedPartner] = useState(null); // Der ausgewählte Carpool-Partner

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
              console.log("Gefundene Carpool-Partner:", usersInArea); // Füge Debugging hinzu
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

  // Funktion zum Öffnen des Dialogs
  const handleClickOpen = (partner) => {
    console.log("Ausgewählter Partner:", partner); // Debugge, welcher Partner ausgewählt wird
    setSelectedPartner(partner); // Den Partner speichern, um ihn im Dialog anzuzeigen
    setOpen(true); // Dialog öffnen
  };

  // Funktion zum Schließen des Dialogs
  const handleClose = () => {
    setOpen(false); // Dialog schließen
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

      {/* Zeige die Fahrgemeinschaften an */}
      <Grid container spacing={3}>
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
                    onClick={() => handleClickOpen(partner)} // Öffne den Dialog mit Partnerinformationen
                  >
                    <ChatIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog zum Anzeigen der E-Mail des Partners */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vereinbare eine Fahrt mit {selectedPartner?.username}</DialogTitle>
        <DialogContent>
          <Typography>
            Sende eine E-Mail an <strong>{selectedPartner?.email}</strong> und vereinbare eine Fahrt.
          </Typography>
          <Typography>
            Beispielnachricht: "Hallo {selectedPartner?.username}, ich würde gerne eine Fahrgemeinschaft organisieren."
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FindCarpoolPartners;
