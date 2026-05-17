import {
  auth,
  db
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ELEMENTS
const userName =
  document.getElementById("userName");

const userInitial =
  document.getElementById("userInitial");

// SESSION
onAuthStateChanged(auth, async (user) => {

  if (user) {

    try {

      // USER DOC
      const userRef =
        doc(db, "users", user.uid);

      const userSnap =
        await getDoc(userRef);

      // EXISTS
      if (userSnap.exists()) {

        const userData =
          userSnap.data();

        // NAME
        userName.textContent =
          `Good Evening, ${userData.name}`;

        // INITIAL
        userInitial.textContent =
          userData.name.charAt(0).toUpperCase();

      }

    } catch (error) {

      console.error(error);

    }

  }

});