import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firestore-Datenbank importieren
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { Container, Typography, TextField, Button, Box, Alert, Checkbox, FormControlLabel, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { DirectionsCar, Chat as ChatIcon } from '@mui/icons-material'; // Importieren eines Icons für Autos und Chat
import { useNavigate } from 'react-router-dom'; // Um zur Chat-Seite zu navigieren
import { useAuth } from './auth'; // Annahme: eine auth.js Datei, um den aktuellen Benutzer abzurufen

const ZipCodePage = () => {
  const [zipCode, setZipCode] = useState('');
  const [willingToCarpool, setWillingToCarpool] = useState(false); // Bereitschaft zur Fahrgemeinschaft
  const [availableSeats, setAvailableSeats] = useState(1); // Anzahl der Sitzplätze
  const [successMessage, setSuccessMessage] = useState('');
  const [carpoolUsers, setCarpoolUsers] = useState([]); // Liste der Carpool-User
  const { currentUser } = useAuth(); // Funktion, um aktuellen Benutzer abzurufen
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Ladeindikator für Fahrgemeinschaften

  // Funktion zum Speichern von PLZ, Bereitschaft und Sitzplätzen
  const handleSubmit = async () => {
    if (!zipCode) {
      alert('Bitte geben Sie eine Postleitzahl ein');
      return;
    }

    if (!willingToCarpool) {
      alert('Bitte bestätigen Sie Ihre Bereitschaft zur Fahrgemeinschaft.');
      return;
    }

    if (availableSeats < 1) {
      alert('Die Anzahl der Sitzplätze muss mindestens 1 sein.');
      return;
    }

    try {
      // Speichern der Postleitzahl, Bereitschaft und Sitzplätze in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        zipCode: zipCode,
        willingToCarpool: willingToCarpool,
        availableSeats: availableSeats,
      }, { merge: true });

      setSuccessMessage('Postleitzahl, Fahrgemeinschaftsbereitschaft und Sitzplätze erfolgreich gespeichert!');

      // Fahrgemeinschaftsbenutzer abrufen
      fetchCarpoolUsers();
    } catch (error) {
      console.error('Fehler beim Speichern der Daten: ', error);
    }
  };

  // Funktion zum Abrufen der Carpool-User
  const fetchCarpoolUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs
      .map(doc => doc.data())
      .filter(user => user.zipCode === zipCode && user.willingToCarpool); // Filtern nach PLZ und Bereitschaft
    setCarpoolUsers(users);
    setLoading(false);
  };

 // Navigiere zur Chat-Seite
  const handleNavigateToChat = (user) => {
    if (user && user.username) {
      navigate('/carpool-chat', { state: { user: { uid: user.uid, username: user.username } } }); // Benutzerinformationen übergeben
    } else {
      console.error('Benutzerdaten fehlen oder sind unvollständig');
    }
  };
  
 

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
          Postleitzahl eingeben
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Geben Sie Ihre Postleitzahl ein, um Fahrgemeinschaften in Ihrer Nähe zu finden.
        </Typography>
      </Box>

      <TextField
        label="Postleitzahl"
        fullWidth
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        variant="outlined"
        style={{ marginBottom: 20 }}
        InputProps={{
          style: { borderRadius: '15px' }
        }}
      />

      {/* Sitzplätze und Checkbox für Fahrgemeinschaftsbereitschaft */}
      <TextField
        label="Verfügbare Sitzplätze"
        type="number"
        fullWidth
        value={availableSeats}
        onChange={(e) => setAvailableSeats(e.target.value)}
        variant="outlined"
        style={{ marginBottom: 20 }}
        InputProps={{
          style: { borderRadius: '15px' }
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={willingToCarpool}
            onChange={(e) => setWillingToCarpool(e.target.checked)}
            color="primary"
          />
        }
        label="Ich bin bereit, an Fahrgemeinschaften teilzunehmen."
        style={{ marginBottom: 20 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        style={{ padding: '10px 20px', borderRadius: '15px' }}
      >
        Speichern
      </Button>

      {/* Erfolgsnachricht */}
      {successMessage && (
        <Alert severity="success" style={{ marginTop: 20 }}>
          {successMessage}
        </Alert>
      )}

      {/* Anzeige der Carpool-Liste */}
      {loading ? (
        <Box mt={4} textAlign="center">
          <CircularProgress />
          <Typography variant="body1" style={{ marginTop: 20 }}>Lade Fahrgemeinschaften...</Typography>
        </Box>
      ) : carpoolUsers.length > 0 ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
            Verfügbare Fahrgemeinschaften
          </Typography>

          <Grid container spacing={3}>
            {carpoolUsers.map((user, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '20px',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    onClick={() => handleNavigateToChat(user)} // Klickbare Box, um zum Chat zu navigieren
                    style={{ cursor: 'pointer', flexGrow: 1 }}
                  >
                    <Typography variant="body1">
                      Benutzername: <strong>{user.username}</strong> <br />
                      PLZ: <strong>{user.zipCode}</strong> <br />
                      Verfügbare Sitzplätze: <strong>{user.availableSeats}</strong>
                    </Typography>
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleNavigateToChat(user)} // Chat-Icon, um zum Chat zu navigieren
                  >
                    <ChatIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography variant="body1" style={{ marginTop: 20, textAlign: 'center' }}>
          Keine Fahrgemeinschaften verfügbar.
        </Typography>
      )}
    </Container>
  );
};

export default ZipCodePage;

