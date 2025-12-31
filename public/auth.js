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
const db = firebase.firestore();

auth.setPersistence(
  firebase.auth.Auth.Persistence.NONE
  ).then(() => {
    console.log('Auth persistence set to NONE');
  }).catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

// create a new user
document.getElementById('signupBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signOut();

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Send email verification
      user.sendEmailVerification()
        .then(() => {
          showWarning("Veuillez vérifier votre email avant de vous connecter.");
        })
        .catch((error) => { alert(error.message); });
      })
    .catch((error) => { showError("Erreur lors de la création du compte"); });
});

// login existing user
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signOut();

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
       const user = userCredential.user;
       if (!user.emailVerified) {
         showError("Email non verifié, veuillez verifier votre email avant de vous connecter.");
         firebase.auth().signOut();
         return;
       }
        console.log('user logger in successfully: ' + user.email);
      })
    .catch((error) => { showError("Email non valide ou mot de passe incorrect"); });
});

auth.onAuthStateChanged(async (user) => {

  if (!user || !user.emailVerified) return;

  console.log('user.email: ' + user.email);
  console.log('user.uid: ' + user.uid);
   
  try{
    const userDoc = await db.collection('users').doc(user.uid).get();

    if( userDoc.data().email !== user.email ){
        showError("Email refusé, pas de droits d'accès. Contactez l'administrateur.");
        await auth.signOut();
        return;
    }
        
    alert('Access granted. Welcome!');

  } catch(error){
    showError("Erreur lors de la vérification des droits d'accès. Contactez l'administrateur.");  
    await auth.signOut();
    return;
  }
});