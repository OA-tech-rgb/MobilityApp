import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const CarpoolChat = () => {
  const location = useLocation();
  const { user } = location.state || {};  // Hole die Benutzerdaten oder setze ein leeres Objekt

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Nachrichten abrufen
  useEffect(() => {
    if (user && user.uid) {  // Überprüfe, ob `user` und `user.uid` existieren
      const q = query(collection(db, 'carpool-chats', user.uid, 'messages'), orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => doc.data()));
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Überprüfe vor der Rückgabe, ob die Benutzerinformationen vorhanden sind
  if (!user || !user.uid) {
    return <Typography variant="h6">Benutzerinformationen fehlen.</Typography>;
  }

  // Nachricht senden
  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      await addDoc(collection(db, 'carpool-chats', user.uid, 'messages'), {
        text: message,
        timestamp: new Date(),
      });
      setMessage(''); // Nachricht zurücksetzen
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht: ', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
        Chat mit {user.username}
      </Typography>

      <Box mb={4}>
        {messages.map((msg, index) => (
          <Paper key={index} style={{ padding: '10px', marginBottom: '10px' }}>
            <Typography>{msg.text}</Typography>
          </Paper>
        ))}
      </Box>

      <TextField
        label="Nachricht"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        variant="outlined"
        style={{ marginBottom: 20 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={sendMessage}
        style={{ padding: '10px 20px' }}
      >
        Nachricht senden
      </Button>
    </Container>
  );
};

export default CarpoolChat;

