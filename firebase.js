// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBH7TLYmt4zmLRZUDi1JsvZBVkdyd5tMuo",
    authDomain: "cafeteria-e2deb.firebaseapp.com",
    projectId: "cafeteria-e2deb",
    storageBucket: "cafeteria-e2deb.appspot.com",
    messagingSenderId: "782094081343",
    appId: "1:782094081343:web:8710947f6e7617c7bc078a"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signOut };
