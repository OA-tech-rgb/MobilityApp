import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Wichtige CSS-Datei für Leaflet

const MapView = () => {
  const position = [48.6970770, 9.6558353];  // Beispiel-Koordinaten (London)

  return (
    <MapContainer center={position} zoom={13} style={{ height: "50vh", width: "50%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Ein Beispiel-Marker! Du kannst hier Parkbereiche hinzufügen.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
