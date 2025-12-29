// firebase config

const firebaseConfig = {
  apiKey: "AIzaSyC2D0cb5zCwtLIPga9_L0hCL3RyYfexj2w",
  authDomain: "chaletmanagement-23fd6.firebaseapp.com",
  projectId: "chaletmanagement-23fd6",
  storageBucket: "chaletmanagement-23fd6.firebasestorage.app",
  messagingSenderId: "1002524392074",
  appId: "1:1002524392074:web:c2c0d6b3afd874f6658b73",
  measurementId: "G-NQV3KFB3MY"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();


// create a new user
document.getElementById('signupBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => { alert('User created successfully!'); })
    .catch((error) => { alert(error.message); });
});

// login existing user
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => { alert('User logged in successfully!'); })
    .catch((error) => { alert(error.message); });
});
