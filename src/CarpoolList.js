import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Container, Typography, Card, CardContent, Grid, Button, Box } from '@mui/material';
import { useAuth } from './auth';
import { Link } from 'react-router-dom';

const FindCarpoolPartners = () => {
  const [carpoolPartners, setCarpoolPartners] = useState([]);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchCarpoolPartners = async () => {
      if (currentUser) {
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', currentUser.uid)));
        const currentUserData = userSnapshot.docs[0]?.data();
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('zipCode', '==', currentUserData.zipCode)));
        const usersInArea = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCarpoolPartners(usersInArea);
      }
    };

    fetchCarpoolPartners();
  }, [currentUser]);

  return (
    <Container maxWidth="md" style={{ marginTop: 50 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
          Fahrgemeinschaften in Ihrer Nähe
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Finden Sie Personen mit einer ähnlichen Postleitzahl und starten Sie eine Chat-Unterhaltung.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {carpoolPartners.map((partner) => (
          <Grid item xs={12} sm={6} key={partner.id}>
            <Card style={{ borderRadius: '15px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {partner.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Postleitzahl: {partner.zipCode}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/chat/${partner.id}`}
                  >
                    Chat starten
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FindCarpoolPartners;
