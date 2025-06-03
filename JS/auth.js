// auth.js
function register(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function login(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

module.exports = { register, login };
