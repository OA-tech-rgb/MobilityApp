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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header /> {/* Header oben */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/parking-status" element={<ParkingStatus />} />
          <Route path="/zip-code" element={<ZipCodePage />} />
          <Route path="/qr-scanner" element={<QRCodeScanner />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/carpool-chat" element={<CarpoolChat />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
        <Footer /> {/* Footer unten */}
      </Router>
    </AuthProvider>
  );
}

export default App;
