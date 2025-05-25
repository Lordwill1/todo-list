// Ganti konfigurasi berikut dengan konfigurasi Firebase kamu
const firebaseConfig = {
    apiKey: "AIzaSyAcTAVS7nYFKbAV4cX-aqOiyPSlXelQWqU",
    authDomain: "final-project-pso-4.firebaseapp.com",
    projectId: "final-project-pso-4",
    storageBucket: "final-project-pso-4.appspot.com",
    messagingSenderId: "752992157581",
    appId: "1:752992157581:web:108101ff0f5763c86dc7c4",
    measurementId: "G-XD962WXQFN"
};
firebase.initializeApp(firebaseConfig);

// Fungsi Login
function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            // alert('Login berhasil!');
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Login Gagal.");
        });
}

// Fungsi Register
function register(e) {
    e.preventDefault();
    const email = document.getElementById('emailReg').value;
    const password = document.getElementById('passwordReg').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert("Registrasi Gagal.");
        });
}