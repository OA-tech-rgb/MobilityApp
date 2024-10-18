import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import QrScanner from 'react-qr-scanner';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert, TextField } from '@mui/material';
import { useAuth } from './auth'; // Um den aktuellen Benutzer zu holen

const QRCodeScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [licensePlate, setLicensePlate] = useState(''); // Kennzeichen Zustand
  const [showLicenseInput, setShowLicenseInput] = useState(false); // Steuert, ob das Kennzeichen-Eingabefeld angezeigt wird
  const { currentUser } = useAuth(); // Hole den aktuellen Benutzer
  const navigate = useNavigate();
  const [parkingId, setParkingId] = useState(null); // Gespeicherte Parkplatz-ID

  const handleScan = async (data) => {
    if (data) {
      setLoading(true);  // Ladezustand aktivieren
      try {
        const scannedParkingId = data.text.trim(); // QR-Code-Daten sollten die Parkplatz-ID enthalten
        setParkingId(scannedParkingId); // Parkplatz-ID speichern
        const parkingRef = doc(db, 'parkings', scannedParkingId);

        // Reserviere den Parkplatz und speichere die Benutzer-ID
        await updateDoc(parkingRef, {
          isReserved: true,
          reservedBy: currentUser.uid, // Reserviere für den aktuellen Benutzer
        });

        // Zeige das Kennzeichen-Eingabefeld und stoppe das Scannen
        setShowLicenseInput(true);
        setScanning(false);
        setLoading(false);
      } catch (error) {
        setError('Fehler beim Reservieren des Parkplatzes.');
        console.error('Fehler beim Reservieren des Parkplatzes:', error);
        setLoading(false);  // Ladezustand deaktivieren
      }
    }
  };

  const handleLicenseSubmit = async () => {
    if (licensePlate.trim() === '') {
      alert('Bitte geben Sie ein gültiges Kennzeichen ein.');
      return;
    }

    try {
      const parkingRef = doc(db, 'parkings', parkingId); // Verwende die gespeicherte Parkplatz-ID

      // Aktualisiere den Parkplatz mit dem Kennzeichen
      await updateDoc(parkingRef, {
        licensePlate: licensePlate,
      });

      // Erfolgsnachricht setzen und Eingabefeld ausblenden
      setSuccessMessage(`Parkplatz ${parkingId} mit Kennzeichen ${licensePlate} erfolgreich reserviert!`);
      setShowLicenseInput(false); // Verberge das Kennzeichen-Eingabefeld

      // Starte die 10-Sekunden-Zeit, nachdem das Kennzeichen eingegeben wurde
      setTimeout(async () => {
        await updateDoc(parkingRef, {
          isReserved: false,
          reservedBy: null, // Benutzer-ID entfernen
          licensePlate: null // Kennzeichen entfernen
        });

        setSuccessMessage(`Reservierung von Parkplatz ${parkingId} wurde automatisch aufgehoben.`);
      }, 10000); // 10 Sekunden Verzögerung
    } catch (error) {
      setError('Fehler beim Speichern des Kennzeichens.');
      console.error('Fehler beim Speichern des Kennzeichens:', error);
    }
  };

  const handleError = (err) => {
    setError('Fehler beim Scannen des QR-Codes.');
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: '100%',
    margin: '0 auto',
    borderRadius: '15px',
    border: '2px solid #1976d2',
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
          QR Code scannen
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bitte scannen Sie den QR-Code des Parkplatzes, um ihn zu reservieren.
        </Typography>
      </Box>

      {/* Ladezustand anzeigen, während der Parkplatz reserviert wird */}
      {loading ? (
        <Box textAlign="center" mb={4}>
          <CircularProgress />
          <Typography variant="body1" style={{ marginTop: 20 }}>
            Parkplatz wird reserviert...
          </Typography>
        </Box>
      ) : (
        <Paper elevation={3} style={{ padding: 20, borderRadius: '15px' }}>
          {error && (
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
          )}

          {successMessage && (
            <Alert severity="success" style={{ marginBottom: 20 }}>
              {successMessage}
            </Alert>
          )}

          {/* QR Scanner-Komponente */}
          {scanning && (
            <QrScanner
              delay={300}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
          )}

          {/* Kennzeichen-Eingabefeld */}
          {showLicenseInput && (
            <Box mt={4}>
              <TextField
                label="Kennzeichen eingeben"
                fullWidth
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                variant="outlined"
                style={{ marginBottom: 20 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleLicenseSubmit}
                style={{ padding: '10px 20px', borderRadius: '15px' }}
              >
                Parkplatz reservieren
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Zurück zur Parkplatzübersicht */}
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/parking-status')}
          style={{ borderRadius: '20px', padding: '10px 30px' }}
        >
          Zurück zur Parkplatzübersicht
        </Button>
      </Box>
    </Container>
  );
};

export default QRCodeScanner;
