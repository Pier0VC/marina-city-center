import {
  auth,
  db
} from "./firebase-config.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FORM
const form =
  document.getElementById("registerForm");

// SUBMIT
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    // VALUES
    const name =
      document.getElementById("registerName").value;

    const apartment =
      document.getElementById("registerApartment").value;

    const email =
      document.getElementById("registerEmail").value;

    const password =
      document.getElementById("registerPassword").value;

    // CREATE USER
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // USER
    const user =
      userCredential.user;

    // SAVE USER DATA
    await setDoc(doc(db, "users", user.uid), {

      uid:
        user.uid,

      name,
      apartment,
      email,

      createdAt:
        Timestamp.now(),

      createdPlans:
        0,

      joinedPlans:
        0

    });

    // SUCCESS
    alert("Account created successfully!");

    // REDIRECT
    window.location.href =
      "home.html";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});