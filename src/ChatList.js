import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Firebase-Instanz
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from './auth'; // Auth-Hook für aktuellen Benutzer

const ChatList = () => {
  const { currentUser } = useAuth(); // Aktuellen Benutzer abrufen
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lade alle Chats des aktuellen Benutzers
  useEffect(() => {
    const fetchChats = async () => {
      const q = query(collection(db, 'chats'), where('users', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedChats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(fetchedChats);
      setLoading(false);
    };

    fetchChats();
  }, [currentUser]);

  // Zum spezifischen Chat navigieren
  const openChat = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Deine Chats</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {chats.map(chat => (
            <ListItem button key={chat.id} onClick={() => openChat(chat.id)}>
              <ListItemText primary={`Chat mit: ${chat.users.filter(u => u !== currentUser.uid).join(', ')}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatList;
