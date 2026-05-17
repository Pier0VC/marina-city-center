import {
  db
} from "./firebase-config.js";

import {
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FUNCTION
async function deletePlan(planId) {

  try {

    // CONFIRM
    const confirmDelete =
      confirm("Delete this plan?");

    // CANCEL
    if (!confirmDelete) {

      return;

    }

    // DELETE
    await deleteDoc(
      doc(db, "plans", planId)
    );

    // SUCCESS
    alert("Plan deleted");

    // RELOAD
    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}

// GLOBAL EXPORT
window.deletePlan = deletePlan;