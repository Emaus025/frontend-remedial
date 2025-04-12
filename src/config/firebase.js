import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC7Cz5rDVGUt8pCHJeLmTdnbhaV4g8e9J4",
    authDomain: "proyecto-seguridad-2025.firebaseapp.com",
    databaseURL: "https://proyecto-seguridad-2025-default-rtdb.firebaseio.com",
    projectId: "proyecto-seguridad-2025",
    storageBucket: "proyecto-seguridad-2025.firebasestorage.app",
    messagingSenderId: "1015828072010",
    appId: "1:1015828072010:web:7af230b2b6484d700308b3",
    measurementId: "G-EZG3PQN0XP"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db, collection, getDocs };