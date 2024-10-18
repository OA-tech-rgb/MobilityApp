import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';  // Importiere Firebase auth

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser;  // Prüft, ob der Benutzer eingeloggt ist

  return user ? children : <Navigate to="/" />;  // Wenn nicht eingeloggt, weiterleiten zur Login-Seite
};

export default PrivateRoute;
