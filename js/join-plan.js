import {
  db,
  auth
} from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FUNCTION
async function joinPlan(planId) {

  try {

    // CURRENT USER
    const currentUser =
      auth.currentUser;

    // NOT LOGGED
    if (!currentUser) {

      alert("You must be logged in");

      return;

    }

    // CHECK EXISTING REQUEST
    const existingQuery = query(
      collection(db, "planJoins"),
      where("planId", "==", planId),
      where("userId", "==", currentUser.uid)
    );

    const existingSnapshot =
      await getDocs(existingQuery);

    // ALREADY REQUESTED
    if (!existingSnapshot.empty) {

      const existingData =
        existingSnapshot.docs[0].data();

      // PENDING
      if (existingData.status === "pending") {

        alert("Your request is pending approval");

        return;

      }

      // APPROVED
      if (existingData.status === "approved") {

        alert("You already joined this plan");

        return;

      }

    }

    // USER DOC
    const userRef =
      doc(db, "users", currentUser.uid);

    const userSnap =
      await getDoc(userRef);

    const userData =
      userSnap.data();

    // SAVE REQUEST
    await addDoc(collection(db, "planJoins"), {

      // PLAN
      planId,

      // USER
      userId:
        currentUser.uid,

      userName:
        userData.name,

      userApartment:
        userData.apartment,

      userEmail:
        userData.email,

      // STATUS
      status:
        "pending",

      // TIMESTAMP
      requestedAt:
        Timestamp.now()

    });

    // SUCCESS
    alert("Join request sent!");

    // RELOAD
    window.location.reload();

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}

// GLOBAL
window.joinPlan = joinPlan;