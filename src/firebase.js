import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase-Konfigurationsdaten
const firebaseConfig = {
  apiKey: "AIzaSyB6H2YwfrL4naMsG9D36l4kY9oZhZ09OL0",
  authDomain: "parking-app-e5860.firebaseapp.com",
  projectId: "parking-app-e5860",
  storageBucket: "parking-app-e5860.appspot.com",
  messagingSenderId: "544334955460",
  appId: "1:544334955460:web:fd018a29b586ba48db5a91",
  measurementId: "G-95PMCLNDT6"
};

// Initialisiere Firebase nur, wenn es noch nicht initialisiert wurde
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];  // Falls Firebase bereits initialisiert ist, verwende die bestehende App
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };  // Exportiere auth und db, damit sie in anderen Dateien verwendet werden können

