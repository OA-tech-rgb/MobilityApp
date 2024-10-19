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
import Header from './Header'; // Importiere die Header-Komponente

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header /> {/* Leiste oben hinzufügen */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/parking-status" element={<ParkingStatus />} />
          <Route path="/zip-code" element={<ZipCodePage />} />
          <Route path="/qr-scanner" element={<QRCodeScanner />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/carpool-chat" element={<CarpoolChat />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
