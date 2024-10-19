import React, { useState } from 'react';
import { Container, Typography, Slider, Box, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const StatisticsPage = () => {
  const [savedTime, setSavedTime] = useState(10); // Standardmäßig 10 Minuten
  const [loading, setLoading] = useState(false);
  const CO2_PER_MINUTE = 0.2; // 200 g CO2 pro Minute gesparter Zeit

  const calculateCO2Savings = (time) => {
    return (time * CO2_PER_MINUTE).toFixed(2); // Rundung auf 2 Dezimalstellen
  };

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false); // Nach kurzer Verzögerung wird das Laden beendet
    }, 1500); // 1,5 Sekunden
  };

  return (
    <Container maxWidth="md" style={{ marginTop: 50 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundImage: 'linear-gradient(90deg, #1976d2, #ff4081)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Statistiken & CO2-Einsparungen
        </Typography>
      </motion.div>

      <Box textAlign="center" marginBottom={4}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h6" style={{ color: '#757575', marginBottom: 20 }}>
            Wie viel Zeit haben Sie bei der Parkplatzsuche gespart?
          </Typography>

          {/* Slider zur Auswahl der gesparten Minuten */}
          <Slider
            value={savedTime}
            onChange={(e, newValue) => setSavedTime(newValue)}
            aria-labelledby="time-slider"
            min={1}
            max={60}
            valueLabelDisplay="auto"
            style={{ marginTop: 30, color: '#1976d2' }}
          />
        </motion.div>
      </Box>

      {/* Anzeige der CO2-Einsparung */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Card
          style={{
            background: 'linear-gradient(135deg, #2196f3 30%, #21cbf3 90%)',
            color: '#fff',
            marginBottom: 30,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
              Sie haben etwa <strong>{calculateCO2Savings(savedTime)} kg CO2</strong> gespart!
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interaktive Schaltfläche */}
      <Box textAlign="center">
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            style={{ padding: '10px 20px', borderRadius: '30px', fontSize: '18px' }}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: '#fff' }} />
            ) : (
              'Ergebnis aktualisieren'
            )}
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
};

export default StatisticsPage;
