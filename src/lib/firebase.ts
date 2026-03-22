import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB2a78YlyaIagPfRGY_n6_KRI97-b0K06U",
  authDomain: "water-pressure-management.firebaseapp.com",
  databaseURL: "https://water-pressure-management-default-rtdb.firebaseio.com",
  projectId: "water-pressure-management",
  storageBucket: "water-pressure-management.firebasestorage.app",
  messagingSenderId: "109668377699",
  appId: "1:109668377699:web:d0bfb2548dc5a3980f4456"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);