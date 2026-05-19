import {
  auth
} from "./firebase-config.js";

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// FORM
const form =
  document.getElementById(
    "forgotPasswordForm"
  );

// SUBMIT
form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    try {

      // EMAIL
      const email =
        document.getElementById(
          "resetEmail"
        ).value;

      // SEND EMAIL
      await sendPasswordResetEmail(
        auth,
        email
      );

      // SUCCESS
      alert(
        "Se envió un enlace de recuperación"
      );

      // REDIRECT
      window.location.href =
        "login.html";

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  }
);