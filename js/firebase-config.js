// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// CONFIG
const firebaseConfig = {

  apiKey: "AIzaSyA7_362VT9d2nWjatfhOpIdVZtuEA1neO8",

  authDomain: "marina-city-center.firebaseapp.com",

  projectId: "marina-city-center",

  storageBucket: "marina-city-center.firebasestorage.app",

  messagingSenderId: "396408061047",

  appId: "1:396408061047:web:2a77c327ea76fd3f299a72"

};

// INIT
const app = initializeApp(firebaseConfig);

// SERVICES
const db = getFirestore(app);
const auth = getAuth(app);

export {
  db,
  auth
};