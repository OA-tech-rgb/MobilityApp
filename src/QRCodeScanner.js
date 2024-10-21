import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import QrScanner from 'react-qr-scanner';
import { Container, Typography, Box, Button, Paper, CircularProgress, Alert, TextField, IconButton } from '@mui/material';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import { useAuth } from './auth';

const QRCodeScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Rückkamera als Standard
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [parkingId, setParkingId] = useState(null);

  // Kamera-Umschalten (zwischen Front- und Rückkamera)
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
  };

  const handleScan = async (data) => {
    if (data) {
      setLoading(true);
      try {
        const scannedParkingId = data.text.trim();
        setParkingId(scannedParkingId);
        const parkingRef = doc(db, 'parkings', scannedParkingId);

        await updateDoc(parkingRef, {
          isReserved: true,
          reservedBy: currentUser.uid,
        });

        setShowLicenseInput(true);
        setScanning(false);
        setLoading(false);
      } catch (error) {
        setError('Fehler beim Reservieren des Parkplatzes.');
        console.error('Fehler beim Reservieren des Parkplatzes:', error);
        setLoading(false);
      }
    }
  };

  const handleLicenseSubmit = async () => {
    if (licensePlate.trim() === '') {
      alert('Bitte geben Sie ein gültiges Kennzeichen ein.');
      return;
    }

    try {
      const parkingRef = doc(db, 'parkings', parkingId);

      await updateDoc(parkingRef, {
        licensePlate: licensePlate,
      });

      setSuccessMessage(`Parkplatz ${parkingId} mit Kennzeichen ${licensePlate} erfolgreich reserviert!`);
      setShowLicenseInput(false);

      setTimeout(async () => {
        try {
          await updateDoc(parkingRef, {
            isReserved: false,
            reservedBy: null,
            licensePlate: null,
          });

          setSuccessMessage(`Reservierung von Parkplatz ${parkingId} wurde automatisch aufgehoben.`);
        } catch (error) {
          console.error('Fehler beim Freigeben des Parkplatzes:', error);
          setError('Fehler beim Freigeben des Parkplatzes. Erneuter Versuch in 5 Sekunden.');

          setTimeout(async () => {
            try {
              await updateDoc(parkingRef, {
                isReserved: false,
                reservedBy: null,
                licensePlate: null,
              });
              setSuccessMessage(`Reservierung von Parkplatz ${parkingId} wurde beim zweiten Versuch aufgehoben.`);
            } catch (error) {
              console.error('Fehler beim erneuten Versuch des Freigebens:', error);
              setError('Fehler beim erneuten Versuch des Freigebens. Bitte versuchen Sie es manuell.');
            }
          }, 5000);
        }
      }, 10000);
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

          {scanning && (
            <>
              <QrScanner
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
                facingMode={facingMode} // Kamera-Modus wird hier angewendet
              />
              <Typography variant="body2" color="textSecondary" style={{ marginTop: 10 }}>
                Aktuelle Kamera: {facingMode === 'environment' ? 'Rückkamera' : 'Frontkamera'}
              </Typography>
              <IconButton onClick={toggleCamera} style={{ marginTop: '10px' }} color="primary">
                <CameraswitchIcon />
              </IconButton>
            </>
          )}

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

