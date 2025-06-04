// JS/auth.js
// Fungsi-fungsi otentikasi. Ini dirancang agar modular dan mudah diuji.

// Fungsi login
async function loginUser(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return userCredential.user; // Mengembalikan objek user yang login
    } catch (error) {
        throw error; // Melemparkan error untuk ditangani oleh pemanggil
    }
}

// Fungsi register. Mengembalikan Promise.
// Tanggung jawab redirect dan alert akan ada di tempat pemanggilan (di HTML Anda).
async function registerUser(email, password) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        return userCredential.user; // Mengembalikan objek user yang terdaftar
    } catch (error) {
        throw error; // Melemparkan error untuk ditangani oleh pemanggil
    }
}

// Untuk Jest (CommonJS module), kita ekspor fungsi-fungsi ini.
// Untuk Browser, kita juga perlu membuatnya global agar bisa dipanggil dari HTML.
// Buat fungsi global untuk digunakan di HTML
window.registerUser = async function(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
};

window.loginUser = async function(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

// Ekspor untuk unit test
module.exports = {
  registerUser: window.registerUser,
  loginUser: window.loginUser,
};


// Implementasi event listener form akan berada di login.html/register.html