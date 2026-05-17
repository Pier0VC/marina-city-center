import {
  db,
  auth
} from "./firebase-config.js";

import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// FORM
const form =
  document.getElementById("createPlanForm");

// COVER IMAGES MAP
const coverImages = {

  "movie-night":
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1400&auto=format&fit=crop",

  "rooftop-party":
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1400&auto=format&fit=crop",

  "sports-night":
    "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1400&auto=format&fit=crop",

  "sunset-lounge":
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop",

  "gaming-night":
    "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1400&auto=format&fit=crop",

  "pool-party":
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1400&auto=format&fit=crop",

  "bbq-night":
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1400&auto=format&fit=crop",

  "networking":
    "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1400&auto=format&fit=crop",

  "wine-night":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1400&auto=format&fit=crop",

  "coffee-meet":
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop"

};

// SUBMIT
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    // CURRENT USER
    const currentUser =
      auth.currentUser;

    // VALIDATION
    if (!currentUser) {

      alert("You must be logged in");

      window.location.href =
        "login.html";

      return;

    }

    // USER DOC
    const userRef =
      doc(db, "users", currentUser.uid);

    const userSnap =
      await getDoc(userRef);

    // USER DATA
    const userData =
      userSnap.data();

    // FORM VALUES
    const title =
      document.getElementById("planTitle").value;

    const description =
      document.getElementById("planDescription").value;

    const date =
      document.getElementById("planDate").value;

    const time =
      document.getElementById("planTime").value;

    const location =
      document.getElementById("planLocation").value;

    const capacity =
      document.getElementById("planCapacity").value;

    const recommendations =
      document.getElementById("planRecommendations").value;

    const selectedCover =
      document.getElementById("planCover").value;

    const whatsappLink =
      document.getElementById("planWhatsapp").value;

    // COVER URL
    const coverImage =
      coverImages[selectedCover];

    // SAVE PLAN
    await addDoc(collection(db, "plans"), {

      // PLAN DATA
      title,
      description,
      date,
      time,
      location,
      capacity,
      recommendations,

      // COVER SYSTEM
      coverType:
        selectedCover,

      coverImage,

      // WHATSAPP
      whatsappLink,

      // CREATOR DATA
      creatorId:
        currentUser.uid,

      creatorName:
        userData.name,

      creatorApartment:
        userData.apartment,

      creatorEmail:
        userData.email,

      // STATS
      residentsJoined:
        0,

      // TIMESTAMP
      createdAt:
        Timestamp.now()

    });

    // SUCCESS
    alert("Plan created successfully!");

    // REDIRECT
    window.location.href =
      "home.html";

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});