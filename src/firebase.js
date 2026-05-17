// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Verileri kaydetmek için Firestore modülü

// Firebase panelinden aldığın senin projenin kimlik bilgileri
const firebaseConfig = {
    apiKey: "AIzaSyAMoBpCwnue8AfgXjQ7NKsKRAHpAbJLZe0",
    authDomain: "media-action-web.firebaseapp.com",
    projectId: "media-action-web",
    storageBucket: "media-action-web.firebasestorage.app",
    messagingSenderId: "770141120225",
    appId: "1:770141120225:web:88ff474039952e284879a0",
    measurementId: "G-Q71J2KMVYE"
};

// Firebase uygulamasını başlatıyoruz
const app = initializeApp(firebaseConfig);

// Diğer bileşenlerden (Admin.jsx vb.) çağırıp kullanabilmek için veritabanını dışa aktarıyoruz
export const db = getFirestore(app);