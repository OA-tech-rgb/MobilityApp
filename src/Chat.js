import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, CircularProgress, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // Firebase-Instanz
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from './auth'; // Auth-Hook für aktuellen Benutzer

const Chat = () => {
  const { chatId } = useParams(); // Chat-ID aus der URL
  const { currentUser } = useAuth(); // Aktuellen Benutzer abrufen
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lade alle Nachrichten des spezifischen Chats in Echtzeit
  useEffect(() => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => doc.data());
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe(); // Listener entfernen, wenn die Komponente nicht mehr verwendet wird
  }, [chatId]);

  // Nachricht senden
  const handleSendMessage = async () => {
    if (message.trim() === '') return; // Leere Nachrichten verhindern

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: message,
      sender: currentUser.uid,
      createdAt: new Date(),
    });

    setMessage(''); // Eingabefeld leeren
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>Chat</Typography>

      {/* Nachrichtenbereich */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', marginBottom: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === currentUser.uid ? 'flex-end' : 'flex-start' }}>
              <Paper sx={{ padding: 1, marginBottom: 1, maxWidth: '70%', backgroundColor: msg.sender === currentUser.uid ? '#1976d2' : '#e0e0e0', color: msg.sender === currentUser.uid ? '#fff' : '#000' }}>
                <Typography>{msg.text}</Typography>
              </Paper>
            </Box>
          ))
        )}
      </Box>

      {/* Eingabefeld */}
      <Box sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nachricht eingeben"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
