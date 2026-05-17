import {
  db,
  auth
} from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONTAINER
const container =
  document.getElementById("profileContainer");

// AUTH
onAuthStateChanged(auth, async (currentUser) => {

  // NO SESSION
  if (!currentUser) {

    window.location.href =
      "login.html";

    return;

  }

  // LOAD
  await loadProfile(currentUser);

});

// LOAD PROFILE
async function loadProfile(currentUser) {

  try {

    // USER
    const userRef =
      doc(db, "users", currentUser.uid);

    const userSnap =
      await getDoc(userRef);

    const user =
      userSnap.data();

    // CREATED PLANS
    const createdQuery = query(
      collection(db, "plans"),
      where("creatorId", "==", currentUser.uid)
    );

    const createdSnapshot =
      await getDocs(createdQuery);

    // JOINED REQUESTS
    const joinedQuery = query(
      collection(db, "planJoins"),
      where("userId", "==", currentUser.uid),
      where("status", "==", "approved")
    );

    const joinedSnapshot =
      await getDocs(joinedQuery);

    // MY PLANS HTML
    let myPlansHTML = "";

    createdSnapshot.forEach((docItem) => {

      const plan =
        docItem.data();

      myPlansHTML += createPlanCard(
        docItem.id,
        plan
      );

    });

    // EMPTY MY PLANS
    if (myPlansHTML === "") {

      myPlansHTML = emptyState(
        "No plans created yet"
      );

    }

    // JOINED PLANS HTML
    let joinedPlansHTML = "";

    // LOOP JOINS
    for (const joinDoc of joinedSnapshot.docs) {

      const joinData =
        joinDoc.data();

      // GET PLAN
      const planRef =
        doc(db, "plans", joinData.planId);

      const planSnap =
        await getDoc(planRef);

      // EXISTS
      if (planSnap.exists()) {

        const plan =
          planSnap.data();

        joinedPlansHTML += createPlanCard(
          planSnap.id,
          plan
        );

      }

    }

    // EMPTY JOINED
    if (joinedPlansHTML === "") {

      joinedPlansHTML = emptyState(
        "No joined plans yet"
      );

    }

    // RENDER
    container.innerHTML = `

      <!-- HERO -->
      <section class="px-6 pt-10">

        <div
          class="bg-gradient-to-r from-[#081C35] to-[#0B1F3A] rounded-[40px] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
        >

          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >

            <!-- USER -->
            <div class="flex items-center gap-6">

              <!-- AVATAR -->
              <div
                class="w-28 h-28 rounded-[32px] bg-[#5DA9E9] flex items-center justify-center text-white text-5xl font-bold"
              >
                ${user.name.charAt(0)}
              </div>

              <!-- INFO -->
              <div>

                <h1
                  class="text-white text-4xl font-bold mb-3"
                >
                  ${user.name}
                </h1>

                <p
                  class="text-gray-300 text-lg mb-2"
                >
                  ${user.apartment}
                </p>

                <p
                  class="text-gray-400"
                >
                  Marina Community Resident
                </p>

              </div>

            </div>

            <!-- LOGOUT -->
            <button
              onclick="logoutUser()"
              class="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
            >
              Logout
            </button>

          </div>

        </div>

      </section>

      <!-- STATS -->
      <section class="px-6 mt-10">

        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-5"
        >

          <div
            class="bg-white rounded-[32px] p-8 shadow-lg"
          >

            <p class="text-gray-400 mb-3">
              Plans Created
            </p>

            <h2
              class="text-4xl font-bold text-[#0B1F3A]"
            >
              ${createdSnapshot.size}
            </h2>

          </div>

          <div
            class="bg-white rounded-[32px] p-8 shadow-lg"
          >

            <p class="text-gray-400 mb-3">
              Joined
            </p>

            <h2
              class="text-4xl font-bold text-[#0B1F3A]"
            >
              ${joinedSnapshot.size}
            </h2>

          </div>

          <div
            class="bg-white rounded-[32px] p-8 shadow-lg"
          >

            <p class="text-gray-400 mb-3">
              Community
            </p>

            <h2
              class="text-4xl font-bold text-[#0B1F3A]"
            >
              21F
            </h2>

          </div>

          <div
            class="bg-white rounded-[32px] p-8 shadow-lg"
          >

            <p class="text-gray-400 mb-3">
              Status
            </p>

            <h2
              class="text-2xl font-bold text-[#5DA9E9]"
            >
              Active
            </h2>

          </div>

        </div>

      </section>

      <!-- MY PLANS -->
      <section class="px-6 mt-12">

        <div
          class="flex items-center justify-between mb-8"
        >

          <h2
            class="text-3xl font-bold text-[#0B1F3A]"
          >
            My Plans
          </h2>

          <button
            onclick="window.location.href='create-plan.html'"
            class="bg-[#5DA9E9] hover:bg-[#79bbf0] text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            Create New
          </button>

        </div>

        <div
          class="grid md:grid-cols-2 gap-8"
        >

          ${myPlansHTML}

        </div>

      </section>

      <!-- JOINED PLANS -->
      <section class="px-6 mt-16 pb-20">

        <div
          class="flex items-center justify-between mb-8"
        >

          <h2
            class="text-3xl font-bold text-[#0B1F3A]"
          >
            Joined Plans
          </h2>

        </div>

        <div
          class="grid md:grid-cols-2 gap-8"
        >

          ${joinedPlansHTML}

        </div>

      </section>

    `;

  } catch (error) {

    console.error(error);

  }

}

// CARD
function createPlanCard(planId, plan) {

  return `

    <div
      onclick="window.location.href='plan-details.html?id=${planId}'"
      class="bg-white rounded-[32px] overflow-hidden shadow-lg cursor-pointer hover:scale-[1.01] transition-all duration-300"
    >

      <!-- IMAGE -->
      <img
        src="${plan.coverImage}"
        class="w-full h-52 object-cover"
      >

      <!-- CONTENT -->
      <div class="p-5">

        <h3
          class="text-xl font-bold text-[#0B1F3A] mb-2"
        >
          ${plan.title}
        </h3>

        <p
          class="text-gray-400 text-sm"
        >
          ${plan.date} · ${plan.time}
        </p>

      </div>

    </div>

  `;

}

// EMPTY STATE
function emptyState(text) {

  return `

    <div
      class="bg-[#F4F7FB] rounded-[32px] p-10 text-center"
    >

      <p class="text-gray-400">
        ${text}
      </p>

    </div>

  `;

}