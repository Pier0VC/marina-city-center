import {
  auth
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// CHECK SESSION
onAuthStateChanged(auth, (user) => {

  // NOT LOGGED
  if (!user) {

    window.location.href =
      "login.html";

  }

});