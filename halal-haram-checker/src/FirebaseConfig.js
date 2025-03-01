// 🔹 Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔹 Konfigurasi Firebase (Ganti dengan konfigurasi dari Firebase Console)
const firebaseConfig = {
  apiKey: 'AIzaSyD6h2CxK9saVu2ogYR_JRINfD38HZp0Iig',
  authDomain: 'klasifikasi-halal-haram.firebaseapp.com',
  projectId: 'klasifikasi-halal-haram',
  storageBucket: 'klasifikasi-halal-haram.firebasestorage.app',
  messagingSenderId: '163819654536',
  appId: '1:163819654536:web:dc1a10ad63196220f8fe3d',
  measurementId: 'G-5TQBWZEYY9',
};
// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
