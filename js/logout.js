import {
  auth
} from "./firebase-config.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// GLOBAL FUNCTION
window.logoutUser = async function () {

  try {

    // LOGOUT
    await signOut(auth);

    // REDIRECT
    window.location.href =
      "login.html";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

};