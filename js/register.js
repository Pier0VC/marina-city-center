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
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FORM
const form =
  document.getElementById("registerForm");

// URL PARAMS
const params =
  new URLSearchParams(
    window.location.search
  );

// INVITE CODE
const inviteCodeFromUrl =
  params.get("code");

// INPUT
const inviteInput =
  document.getElementById(
    "registerInviteCode"
  );

// AUTO FILL
if (inviteCodeFromUrl) {

  inviteInput.value =
    inviteCodeFromUrl;

  // LOCK INPUT
  inviteInput.readOnly =
    true;

  // OPTIONAL STYLE
  inviteInput.classList.add(
    "opacity-70",
    "cursor-not-allowed"
  );

}

// SUBMIT
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    // VALUES
    const name =
      document.getElementById("registerName")
        .value
        .trim();

    const inviteCode =
      document.getElementById("registerInviteCode")
        .value
        .trim()
        .toUpperCase();

    const email =
      document.getElementById("registerEmail")
        .value
        .trim();

    const password =
      document.getElementById("registerPassword")
        .value;

    // VALIDATIONS
    if (password.length < 6) {

      alert(
        "La contraseña debe tener al menos 6 caracteres"
      );

      return;

    }

    // VALIDATE INVITE CODE
    const inviteQuery = query(
      collection(db, "inviteCodes"),
      where("code", "==", inviteCode)
    );

    const inviteSnapshot =
      await getDocs(inviteQuery);

    // INVALID CODE
    if (inviteSnapshot.empty) {

      alert(
        "Código de invitación inválido"
      );

      return;

    }

    // INVITE DOC
    const inviteDoc =
      inviteSnapshot.docs[0];

    // DATA
    const inviteData =
      inviteDoc.data();

    // LIMIT REACHED
    if (
      inviteData.registrations >=
      inviteData.maxRegistrations
    ) {

      alert(
        "Este código alcanzó su límite"
      );

      return;

    }

    // APARTMENT
    const apartment =
      inviteData.apartment;

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

    // SAVE USER
    await setDoc(
      doc(db, "users", user.uid),
      {

        uid:
          user.uid,

        name,

        apartment,

        email,

        inviteCode,

        createdAt:
          Timestamp.now(),

        createdPlans:
          0,

        joinedPlans:
          0

      }
    );

    // UPDATE INVITE USAGE
    await updateDoc(
      inviteDoc.ref,
      {

        registrations:
          increment(1)

      }
    );

    // SUCCESS
    alert(
      "¡Cuenta creada exitosamente!"
    );

    // REDIRECT
    window.location.href =
      "home.html";

  } catch (error) {

    console.error(error);

    // EMAIL EXISTS
    if (
      error.code ===
      "auth/email-already-in-use"
    ) {

      alert(
        "Este correo ya está registrado"
      );

      return;

    }

    // WEAK PASSWORD
    if (
      error.code ===
      "auth/weak-password"
    ) {

      alert(
        "La contraseña es demasiado débil"
      );

      return;

    }

    // INVALID EMAIL
    if (
      error.code ===
      "auth/invalid-email"
    ) {

      alert(
        "Correo inválido"
      );

      return;

    }

    alert(error.message);

  }

});