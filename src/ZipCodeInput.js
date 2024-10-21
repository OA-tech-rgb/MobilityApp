import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Checkbox, FormControlLabel, Grid, Paper, IconButton, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { db } from './firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from './auth';

const ZipCodePage = () => {
  const [zipCode, setZipCode] = useState('');
  const [willingToCarpool, setWillingToCarpool] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(1);
  const [role, setRole] = useState(''); // Hinzugefügt: Fahrer/Beifahrer-Auswahl
  const [successMessage, setSuccessMessage] = useState('');
  const [carpoolUsers, setCarpoolUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!zipCode) {
      alert('Bitte geben Sie eine Postleitzahl ein');
      return;
    }

    if (!willingToCarpool) {
      alert('Bitte bestätigen Sie Ihre Bereitschaft zur Fahrgemeinschaft.');
      return;
    }

    if (role === 'Fahrer' && availableSeats < 1) {
      alert('Fahrer müssen mindestens einen Sitzplatz angeben.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        zipCode,
        willingToCarpool,
        availableSeats: role === 'Fahrer' ? availableSeats : 0, // Nur Fahrer müssen Sitzplätze angeben
        role, // Speichern der Rolle (Fahrer/Beifahrer)
      }, { merge: true });

      setSuccessMessage('Postleitzahl, Fahrgemeinschaftsbereitschaft und Sitzplätze erfolgreich gespeichert!');
      fetchCarpoolUsers();
    } catch (error) {
      console.error('Fehler beim Speichern der Daten: ', error);
    }
  };

  const fetchCarpoolUsers = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs
      .map(doc => doc.data())
      .filter(user => user.zipCode === zipCode && user.willingToCarpool);
    setCarpoolUsers(users);
    setLoading(false);
  };

  const handleNavigateToChat = (user) => {
    setSelectedUser(user); 
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
          style: { borderRadius: '15px', backgroundColor: '#f5f5f5' }
        }}
      />

      {/* Fahrer/Beifahrer-Auswahl */}
      <FormControl fullWidth variant="outlined" style={{ marginBottom: 20 }}>
        <InputLabel>Rolle</InputLabel>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label="Rolle"
        >
          <MenuItem value="Fahrer">Fahrer</MenuItem>
          <MenuItem value="Beifahrer">Beifahrer</MenuItem>
        </Select>
      </FormControl>

      {/* Zeige nur das Sitzplatzfeld an, wenn der Benutzer Fahrer ist */}
      {role === 'Fahrer' && (
        <TextField
          label="Verfügbare Sitzplätze"
          type="number"
          fullWidth
          value={availableSeats}
          onChange={(e) => setAvailableSeats(e.target.value)}
          variant="outlined"
          style={{ marginBottom: 20 }}
          InputProps={{
            style: { borderRadius: '15px', backgroundColor: '#f5f5f5' }
          }}
        />
      )}

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

      {/* Button ist deaktiviert, wenn keine Rolle ausgewählt ist */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!role}  // Button ist nur aktiv, wenn eine Rolle ausgewählt wurde
        style={{ padding: '10px 20px', borderRadius: '15px', backgroundColor: role ? '#1976d2' : '#ccc' }}
      >
        Speichern
      </Button>

      {successMessage && (
        <Alert severity="success" style={{ marginTop: 20, borderRadius: '15px' }}>
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box mt={4} textAlign="center">
          <CircularProgress />
          <Typography variant="body1" style={{ marginTop: 20 }}>Lade Fahrgemeinschaften...</Typography>
        </Box>
      ) : carpoolUsers.length > 0 ? (
        <Box mt={4} style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Scrollbarer Container */}
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
            Verfügbare Fahrgemeinschaften
          </Typography>

          <Grid container spacing={3} style={{ maxHeight: '300px' }}> {/* Begrenzung auf 3 Karten */}
            {carpoolUsers.map((user, index) => (
              <Grid item xs={12} key={index}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fafafa',
                    border: '1px solid #ddd',
                    boxShadow: '0 3px 5px rgba(0,0,0,0.1)', // Elegantere Schatten
                  }}
                >
                  <Box
                    onClick={() => handleNavigateToChat(user)}
                    style={{ cursor: 'pointer', flexGrow: 1 }}
                  >
                    <Typography variant="body1" style={{ fontWeight: 'bold', color: '#333' }}>
                      Benutzername: <strong>{user.username}</strong> <br />
                      PLZ: <strong>{user.zipCode}</strong> <br />
                      Rolle: <strong>{user.role}</strong> {/* Rolle des Benutzers anzeigen */}
                      {user.role === 'Fahrer' && (
                        <>
                          <br /> Verfügbare Sitzplätze: <strong>{user.availableSeats}</strong>
                        </>
                      )}
                    </Typography>
                  </Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleNavigateToChat(user)}
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

      {selectedUser && (
        <Paper
          elevation={5}
          style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: '#e3f2fd',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#1976d2' }}>
            Fahrt organisieren mit {selectedUser.username}
          </Typography>
          <Typography variant="body1" style={{ marginTop: '10px', color: '#333' }}>
            Sende eine E-Mail an <strong>{selectedUser.email}</strong>, um eine Fahrt zu vereinbaren.
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px' }}>
            Beispielnachricht: "Hallo {selectedUser.username}, ich würde gerne eine Fahrgemeinschaft organisieren."
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setSelectedUser(null)}
              style={{ padding: '10px 20px', borderRadius: '20px' }}
            >
              Schließen
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ZipCodePage;
