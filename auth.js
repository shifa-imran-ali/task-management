import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
// import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"; 
const firebaseConfig = {
  apiKey: "AIzaSyBR03RmpL1Es5kdQsoecnExLAWCb-YWHME",
  authDomain: "task-manager-898af.firebaseapp.com",
  projectId: "task-manager-898af",
  storageBucket: "task-manager-898af.firebasestorage.app",
  messagingSenderId: "770005155353",
  appId: "1:770005155353:web:c08ce431ee89123d7e3488",
  measurementId: "G-2PYBS8H3DM"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getDatabase(app);
const provider = new GoogleAuthProvider();
//signup
document.getElementById("signup")?.addEventListener('click', (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
    .then(()=>{
        alert("Sign up successfully!!");
        window.location.href = "login.html";
    })
    .catch((error)=>{
        alert(error.message);
    })
});
//login
document.getElementById("login")?.addEventListener("click", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
    .then(()=>{
        alert("Login successfully!!");
        window.location.href = "dashboard.html";
    })
    .catch((error)=>{
        alert(error.message);
    });
})
//signup with google
document.getElementById("google-btn")?.addEventListener("click", (e)=>{
    e.preventDefault();
    signInWithPopup(auth, provider)
    .then(()=>{
        alert("logged in successfully!!");
        window.location.href = "dashboard.html";
    })
})
// Logout
document.getElementById("logout-btn")?.addEventListener("click", () => {
    signOut(auth)
    .then(() => {
        alert("Logged Out Successfully!");
        window.location.href = "login.html";
    })
    .catch((error) => {
        alert(error.message);
    });
});

// Password Reset
document.getElementById('reset')?.addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset link sent!");
        document.getElementById('email').value = "";
      })
      .catch((error) => {
        alert(error.message);
      });
});
