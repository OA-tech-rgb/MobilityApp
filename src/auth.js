import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, createContext, useContext } from 'react';

// Firebase-Konfiguration - hier müssen deine eigenen Firebase-Daten rein
const firebaseConfig = {
  apiKey: "AIzaSyB6H2YwfrL4naMsG9D36l4kY9oZhZ09OL0",
  authDomain: "parking-app-e5860.firebaseapp.com",
  projectId: "parking-app-e5860",
  storageBucket: "parking-app-e5860.appspot.com",
  messagingSenderId: "544334955460",
  appId: "1:544334955460:web:fd018a29b586ba48db5a91",
  measurementId: "G-95PMCLNDT6"
};

// Initialisiere Firebase App und Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Erstelle einen Kontext für die Authentifizierung
const AuthContext = createContext();

// Custom Hook für den Zugriff auf den Auth-Kontext
export const useAuth = () => useContext(AuthContext);

// AuthProvider-Komponente, um den Authentifizierungsstatus global bereitzustellen
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Zustand für den aktuellen Benutzer
  const [loading, setLoading] = useState(true); // Zustand für das Laden

  useEffect(() => {
    // Überwache den Authentifizierungsstatus des Benutzers
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Setze den aktuellen Benutzer
      setLoading(false); // Setze das Laden auf false, sobald der Auth-Status geladen ist
    });
    
    // Bereinige den Listener beim Unmount
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Zeige einen Ladeindikator an, bis der Auth-Status geladen ist
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children} {/* Alle Kinder-Komponenten haben jetzt Zugriff auf den Auth-Kontext */}
    </AuthContext.Provider>
  );
};

export { auth };
