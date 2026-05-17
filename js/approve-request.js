import {
  db
} from "./firebase-config.js";

import {
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// APPROVE REQUEST
async function approveRequest(joinId) {

  try {

    // UPDATE STATUS
    await updateDoc(
      doc(db, "planJoins", joinId),
      {

        status:
          "approved"

      }
    );

    // SUCCESS
    alert("Resident approved!");

    // RELOAD
    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}

// REJECT REQUEST
async function rejectRequest(joinId) {

  try {

    // UPDATE STATUS
    await updateDoc(
      doc(db, "planJoins", joinId),
      {

        status:
          "rejected"

      }
    );

    // SUCCESS
    alert("Request rejected");

    // RELOAD
    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}

// GLOBALS
window.approveRequest =
  approveRequest;

window.rejectRequest =
  rejectRequest;