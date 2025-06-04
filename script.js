// script.js
// Ini adalah file yang dimuat di HTML Anda (index.html, login.html, register.html).
// Fungsinya hanya untuk menginisialisasi Firebase SDK di browser dan membuatnya global.

// Ganti konfigurasi berikut dengan konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyAcTAVS7nYFKbAV4cX-aqOiyPSlXelQWqU",
    authDomain: "final-project-pso-4.firebaseapp.com",
    projectId: "final-project-pso-4",
    storageBucket: "final-project-pso-4.appspot.com",
    messagingSenderId: "752992157581",
    appId: "1:752992157581:web:108101ff0f5763c86dc7c4",
    measurementId: "G-XD962WXQFN"
};

// Inisialisasi Firebase. Objek `firebase` ini akan menjadi global di browser (`window.firebase`).
firebase.initializeApp(firebaseConfig);

// Tidak ada kode logika lain di sini. Semua logika lain ada di file JS/ terpisah.