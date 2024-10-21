import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth'; 
import Login from './Login';
import ParkingStatus from './ParkingStatus';
import ZipCodePage from './ZipCodeInput';
import QRCodeScanner from './QRCodeScanner';
import StatisticsPage from './StatisticsPage';
import CarpoolChat from './CarpoolChat';
import MapView from './MapView';
import Header from './Header'; // Header-Komponente importieren
import Footer from './Footer'; // Footer-Komponente importieren
import { Box } from '@mui/material'; // Importiere Box für Layout

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Layout-Container */}
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh' // Gesamtseite füllt den Viewport
          }}
        >
          <Header /> {/* Header bleibt oben */}
          
          {/* Flexibler Seiteninhalt */}
          <Box 
            component="main" 
            sx={{
              flexGrow: 1, // Nimmt den restlichen Platz ein
              padding: '20px' // Optional: Innenabstand
            }}
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/parking-status" element={<ParkingStatus />} />
              <Route path="/zip-code" element={<ZipCodePage />} />
              <Route path="/qr-scanner" element={<QRCodeScanner />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/carpool-chat" element={<CarpoolChat />} />
              <Route path="/map" element={<MapView />} />
            </Routes>
          </Box>

          <Footer /> {/* Footer bleibt unten */}
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;
