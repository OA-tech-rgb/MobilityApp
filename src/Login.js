import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox, Link } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase'; // Firestore-Datenbank importieren
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Firestore-Datenbank Funktionen
import { useNavigate } from 'react-router-dom';
import logo from './assets/Logo.png'; // Pfad zu deinem Logo

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Neuen Zustand für den Benutzernamen hinzufügen
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [privacyChecked, setPrivacyChecked] = useState(false); // Zustand für die Datenschutz-Checkbox
  const navigate = useNavigate();

  // Funktion zum Registrieren eines neuen Benutzers
  const handleRegister = () => {
    if (!username) {
      setMessage('Bitte geben Sie einen Benutzernamen ein.');
      return;
    }

    if (!privacyChecked) { // Überprüfen, ob die Datenschutzrichtlinie akzeptiert wurde
      setMessage('Bitte akzeptieren Sie die Datenschutzrichtlinien.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Benutzernamen und E-Mail in Firestore unter der Benutzer-ID (uid) speichern
        return setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: email
        });
      })
      .then(() => {
        setMessage('Registrierung erfolgreich!');
        navigate('/parking-status');  // Weiterleitung nach erfolgreicher Registrierung
      })
      .catch((error) => {
        setMessage(`Registrierungsfehler: ${error.message}`);
      });
  };

  // Funktion zum Einloggen eines existierenden Benutzers
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Überprüfen, ob der Benutzer bereits in Firestore existiert
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Wenn der Benutzer noch nicht in Firestore existiert, speichere die E-Mail und uid
          await setDoc(userDocRef, {
            email: user.email, // Nur die E-Mail speichern, Benutzername kann hier hinzugefügt werden
          });
        } else {
          // Optional: E-Mail immer aktualisieren
          await setDoc(userDocRef, { email: user.email }, { merge: true });
        }

        setMessage('Login erfolgreich!');
        navigate('/parking-status');  // Weiterleitung nach erfolgreichem Login
      })
      .catch((error) => {
        setMessage(`Login-Fehler: ${error.message}`);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          padding: 4,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
          backgroundColor: '#fff'
        }}
      >
        {/* Logo hinzufügen */}
        <img src={logo} alt="App Logo" style={{ width: '270px', marginBottom: '20px' }} />

        <Typography variant="h4" gutterBottom>
          {isRegistering ? 'Registrieren' : 'Login'}
        </Typography>

        {/* Benutzernamen Feld nur anzeigen, wenn registriert wird */}
        {isRegistering && (
          <TextField
            label="Benutzername"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        {/* E-Mail Feld */}
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Passwort Feld */}
        <TextField
          label="Passwort"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Datenschutz Checkbox mit Link zu den Richtlinien */}
        {isRegistering && (
          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  Ich akzeptiere die{' '}
                  <Link href="/Datenschutzrichtlinien.pdf" target="_blank" rel="noopener noreferrer">
                    Datenschutzrichtlinien
                  </Link>
                </Typography>
              }
            />
          </Box>
        )}

        {/* Registrierung oder Login Button */}
        {isRegistering ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            fullWidth
            style={{ marginTop: 20 }}
          >
            Registrieren
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            style={{ marginTop: 20 }}
          >
            Login
          </Button>
        )}

        {/* Umschalten zwischen Login und Registrierung */}
        <Button
          onClick={() => setIsRegistering(!isRegistering)}
          color="secondary"
          style={{ marginTop: 20 }}
        >
          {isRegistering ? 'Zum Login wechseln' : 'Zur Registrierung wechseln'}
        </Button>

        {/* Fehlermeldung oder Erfolgsnachricht */}
        {message && (
          <Typography
            variant="body1"
            color={message.includes('erfolgreich') ? 'green' : 'error'}
            style={{ marginTop: 20 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Login;
