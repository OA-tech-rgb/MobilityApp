import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Paper } from '@mui/material';
import { useAuth } from './auth'; 
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const Settings = () => {
  const { currentUser } = useAuth(); // Aktuellen Benutzer abrufen
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  // Benutzerinformationen laden
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setUsername(currentUser.displayName || 'Nutzername'); // Setzt einen Default-Wert, wenn kein Name vorhanden ist
    }
  }, [currentUser]);

  // PLZ und Mitfahrbereitschaft zurücksetzen
  const handleWithdraw = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        zipCode: '', // PLZ zurücksetzen
        willingToCarpool: false, // Bereitschaft zurücksetzen
      });
      alert('Ihre Postleitzahl und Fahrgemeinschaftsbereitschaft wurden erfolgreich zurückgezogen.');
    } catch (error) {
      console.error('Fehler beim Zurückziehen:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Einstellungen</Typography>
      
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6">Nutzerinformationen</Typography>
        <TextField
          label="Email"
          value={email}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Nutzername"
          value={username}
          fullWidth
          disabled
        />
      </Paper>

      <Button variant="contained" color="primary" onClick={handleWithdraw}>
        PLZ und Mitfahrbereitschaft zurücksetzen
      </Button>
    </Box>
  );
};

export default Settings;
