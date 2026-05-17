import {
  auth
} from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// FORM
const form =
  document.querySelector("form");

// SUBMIT
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    // VALUES
    const email =
      document.getElementById("loginEmail").value;

    const password =
      document.getElementById("loginPassword").value;

    // LOGIN
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // SUCCESS
    alert("Welcome back!");

    // REDIRECT
    window.location.href =
      "home.html";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});