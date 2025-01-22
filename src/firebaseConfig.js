// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBBLrA6l5DbXN45jBzjKDhaU5jMR3-_9NI",
  authDomain: "videolisting-55585.firebaseapp.com",
  projectId: "videolisting-55585",
  storageBucket: "videolisting-55585.firebasestorage.app",
  messagingSenderId: "43864299622",
  appId: "1:43864299622:web:95e5048ee6fc6571a475a7",
  measurementId: "G-L2G2PRTV5T"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth, Firestore y Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
