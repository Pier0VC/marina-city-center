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

// CATEGORY BUTTONS
const categoryButtons =
  document.querySelectorAll(".category-btn");

// SELECTED CATEGORY
const selectedCategory =
  document.getElementById("selectedCategory");

// RESET
function resetCategories() {

  categoryButtons.forEach((btn) => {

    btn.classList.remove(
      "scale-110",
      "shadow-2xl",
      "ring-4",
      "ring-blue-300",
      "ring-orange-300",
      "ring-purple-300",
      "ring-green-300"
    );

  });

}

// ACTIVATE
function activateCategory(button) {

  // COLOR
  const color =
    button.dataset.active;

  // BASE EFFECTS
  button.classList.add(
    "scale-110",
    "shadow-2xl",
    "ring-4"
  );

  // COLOR RING
  button.classList.add(
    `ring-${color}-300`
  );

}

// DEFAULT ACTIVE
activateCategory(categoryButtons[0]);

// EVENTS
categoryButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // RESET
    resetCategories();

    // ACTIVATE
    activateCategory(button);

    // SAVE VALUE
    selectedCategory.value =
      button.dataset.category;

  });

});

// COVER IMAGES MAP
const coverImages = {

  "sports-meetup":
  "https://images.unsplash.com/photo-1598881034666-6d3443d4b1bc?q=80&w=1170&auto=format&fit=crop",

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


// PREVIEW BUTTON
const previewBtn =
  document.getElementById("previewPlanBtn");

// MODAL
const previewModal =
  document.getElementById("previewModal");

// CONTENT
const previewContent =
  document.getElementById("previewContent");

// PREVIEW
previewBtn.addEventListener("click", () => {

  // VALUES
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

  const selectedCover =
    document.getElementById("planCover").value;

  const category =
    selectedCategory.value;

  // COVER
  const coverImage =
    coverImages[selectedCover];

  // RENDER
  previewContent.innerHTML = `

    <div
      class="bg-white rounded-[40px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.25)] animate-[fadeIn_.3s_ease]"
    >

      <!-- IMAGE -->
      <img
        src="${coverImage}"
        class="w-full h-72 object-cover"
      >

      <!-- CONTENT -->
      <div class="p-8">

        <!-- CATEGORY -->
        <div class="mb-5">

          <span
            class="bg-[#EEF4FF] text-[#5DA9E9] px-4 py-2 rounded-full text-sm font-semibold"
          >
            ${category}
          </span>

        </div>

        <!-- TITLE -->
        <h2
          class="text-4xl font-bold text-[#0B1F3A] mb-5"
        >
          ${title || "Título del Plan"}
        </h2>

        <!-- DESCRIPTION -->
        <p
          class="text-gray-500 leading-relaxed mb-8"
        >
          ${description || "Descripción del plan..."}
        </p>

        <!-- INFO -->
        <div class="space-y-4 mb-8">

          <div
            class="flex items-center justify-between"
          >

            <span class="text-gray-400">
              Fecha
            </span>

            <span class="font-semibold text-[#0B1F3A]">
              ${date || "--"}
            </span>

          </div>

          <div
            class="flex items-center justify-between"
          >

            <span class="text-gray-400">
              Hora
            </span>

            <span class="font-semibold text-[#0B1F3A]">
              ${time || "--"}
            </span>

          </div>

          <div
            class="flex items-center justify-between"
          >

            <span class="text-gray-400">
              Ubicación
            </span>

            <span class="font-semibold text-[#0B1F3A]">
              ${location || "--"}
            </span>

          </div>

          <div
            class="flex items-center justify-between"
          >

            <span class="text-gray-400">
              Capacidad
            </span>

            <span class="font-semibold text-[#0B1F3A]">
              ${capacity || "--"} residentes
            </span>

          </div>

        </div>

        <!-- BUTTONS -->
        <div class="flex gap-4">

          <!-- CLOSE -->
          <button
            onclick="closePreview()"
            class="w-full bg-[#EEF4FA] text-[#0B1F3A] py-4 rounded-2xl font-semibold"
          >
            Cerrar
          </button>

          <!-- PUBLISH -->
          <button
            onclick="document.getElementById('publishPlanBtn').click()"
            class="w-full bg-[#5DA9E9] hover:bg-[#79bbf0] text-white py-4 rounded-2xl font-semibold transition-all duration-300"
          >
            Publicar
          </button>

        </div>

      </div>

    </div>

  `;

  // SHOW
  previewModal.classList.remove(
    "hidden"
  );

  previewModal.classList.add(
    "flex"
  );

});

// CLOSE FUNCTION
window.closePreview = function () {

  previewModal.classList.add(
    "hidden"
  );

  previewModal.classList.remove(
    "flex"
  );

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

    const category =
      selectedCategory.value;    

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
      category,
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