import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './auth'; // AuthProvider muss die App umschließen
import Login from './Login';
import ParkingStatus from './ParkingStatus';
import ZipCodePage from './ZipCodeInput';
import QRCodeScanner from './QRCodeScanner';  // Importiere den QR-Scanner
import StatisticsPage from './StatisticsPage'; // Neue Statistik-Seite importieren
import CarpoolChat from './CarpoolChat';  // Chat-Seite importieren
import 'leaflet/dist/leaflet.css';
import MapView from './MapView';  // Importiere die neue MapView-Komponente



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/parking-status" element={<ParkingStatus />} />
          <Route path="/zip-code" element={<ZipCodePage />} />
          <Route path="/qr-scanner" element={<QRCodeScanner />} /> {/* Route für QR-Scanner */}
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/carpool-chat" element={<CarpoolChat />} /> {/* Neue Route für den Carpool Chat */}
          <Route path="/map" element={<MapView />} />  {/* Neue Route für die Karte */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
