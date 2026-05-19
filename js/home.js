import {
  db,
  auth
} from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONTAINER
const eventsContainer =
  document.getElementById("eventsContainer");

// SEARCH
const searchInput =
  document.getElementById("searchInput");

// FILTER BUTTONS
const filterButtons =
  document.querySelectorAll(".filter-btn");

// CURRENT FILTER
let currentFilter =
  "all";  

// ALL PLANS
let allPlans = [];  

// APPLY FILTERS
function applyFilters() {

  // SEARCH VALUE
  const searchValue =
    searchInput.value.toLowerCase();

  // CARDS
  const cards =
    document.querySelectorAll(".plan-card");

  cards.forEach((card) => {

    // TEXT
    const text =
      card.innerText.toLowerCase();

    // CATEGORY
    const category =
      card.dataset.category;

    // SEARCH MATCH
    const matchesSearch =
      text.includes(searchValue);

    // FILTER MATCH
    const matchesFilter =
      currentFilter === "all" ||
      category === currentFilter;

    // SHOW/HIDE
    if (
      matchesSearch &&
      matchesFilter
    ) {

      card.style.display =
        "block";

    } else {

      card.style.display =
        "none";

    }

  });

}

// LOAD PLANS
async function loadPlans() {

  try {

    // CURRENT USER
    const currentUser =
      auth.currentUser;

    // QUERY
    const plansQuery = query(
      collection(db, "plans")
    );

    // SNAPSHOT
    const plansSnapshot =
      await getDocs(plansQuery);

    // MAP PLANS
    allPlans = plansSnapshot.docs.map((doc) => ({

      id:
        doc.id,

      ...doc.data()

    }));

    // SORT BY EVENT DATE
    allPlans.sort((a, b) => {

      const dateA =
        new Date(`${a.date}T${a.time}`);

      const dateB =
        new Date(`${b.date}T${b.time}`);

      return dateA - dateB;

    });  

    // CLEAR
    eventsContainer.innerHTML = "";

    // LOOP PLANS
    for (const planData of allPlans) {

      // PLAN
      const plan =
        planData;

      // PLAN ID
      const planId =
        planData.id;

      // OWNER
      const isOwner =
        currentUser &&
        currentUser.uid === plan.creatorId;

      // JOIN STATUS
      let joinStatus =
        "not_joined";

      // ATTENDEES
      let attendeesCount =
        1;

      // CHECK JOINS
      if (currentUser) {

        const joinQuery = query(
          collection(db, "planJoins"),
          where("planId", "==", planId),
          where("userId", "==", currentUser.uid)
        );

        const joinSnapshot =
          await getDocs(joinQuery);

        // EXISTS
        if (!joinSnapshot.empty) {

          const joinData =
            joinSnapshot.docs[0].data();

          joinStatus =
            joinData.status;

        }

      }

      // COUNT APPROVED USERS
      const attendeesQuery = query(
        collection(db, "planJoins"),
        where("planId", "==", planId),
        where("status", "==", "approved")
      );

      const attendeesSnapshot =
        await getDocs(attendeesQuery);

      attendeesCount +=
        attendeesSnapshot.size;

      // ACTION BUTTON
      let actionButton = "";

      // OWNER
      if (isOwner) {

        actionButton = `

          <button
            onclick="deletePlan('${planId}')"
            class="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            Delete
          </button>

        `;

      }

      // PENDING
      else if (joinStatus === "pending") {

        actionButton = `

          <button
            class="bg-yellow-400 text-white px-5 py-3 rounded-2xl font-semibold cursor-default"
          >
            Pending Approval
          </button>

        `;

      }

      // APPROVED
      else if (joinStatus === "approved") {

        actionButton = `

          <a
            href="${plan.whatsappLink}"
            target="_blank"
            class="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            WhatsApp
          </a>

        `;

      }

      // NOT JOINED
      else {

        actionButton = `

          <button
            onclick="joinPlan('${planId}')"
            class="bg-[#5DA9E9] hover:bg-[#79bbf0] text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
          >
            Request Join
          </button>

        `;

      }

      // CARD
      const card = `

        <div
          data-category="${plan.category}" class="plan-card bg-white rounded-[36px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-500"
        >

          <!-- COVER -->
          <div class="relative">

            <img
              src="${plan.coverImage}"
              class="w-full h-80 object-cover"
            >

            <!-- OVERLAY -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
            ></div>

            <!-- CATEGORY -->
            <div
              class="absolute top-5 left-5 bg-white/20 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20"
            >
              ${plan.location}
            </div>          


            <!-- TITLE -->
            <div
              class="absolute bottom-6 left-6 right-6"
            >

              <h2
                class="text-white text-3xl font-bold mb-3"
              >
                ${plan.title}
              </h2>

              <p
                class="text-white/80 text-sm"
              >
                ${plan.date} · ${plan.time}
              </p>

            </div>

          </div>

          <!-- CONTENT -->
          <div class="p-6">

            <!-- DESCRIPTION -->
            <p
              class="text-gray-500 leading-relaxed mb-6"
            >
              ${plan.description}
            </p>

            <!-- ATTENDEES -->
            <div
              class="flex items-center justify-between mb-6"
            >

              <div class="flex items-center">

                <div class="flex -space-x-3">

                  <div
                    class="w-10 h-10 rounded-full bg-[#5DA9E9] border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  >
                    ${plan.creatorName.charAt(0)}
                  </div>

                  <div
                    class="w-10 h-10 rounded-full bg-[#0B1F3A] border-2 border-white flex items-center justify-center text-white text-sm font-bold"
                  >
                    +${attendeesCount}
                  </div>

                </div>

                <p
                  class="ml-4 text-gray-400 text-sm"
                >
                  Residents attending
                </p>

              </div>

            </div>

            <!-- FOOTER -->
            <div
              class="flex items-center justify-between gap-4"
            >

              <!-- CREATOR -->
              <div>

                <p
                  class="text-[#5DA9E9] text-sm font-semibold"
                >
                  Created by ${plan.creatorName}
                </p>

                <p
                  class="text-gray-400 text-xs"
                >
                  ${plan.creatorApartment}
                </p>

              </div>

              <!-- ACTIONS -->
              <div class="flex items-center gap-3">

                <!-- DETAILS -->
                <button
                  onclick="window.location.href='plan-details.html?id=${planId}'"
                  class="bg-[#E8EEF5] hover:bg-[#dfe8f1] text-[#0B1F3A] px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  Details
                </button>

                <!-- ACTION -->
                ${actionButton}

              </div>

            </div>

          </div>

        </div>

      `;

      // APPEND
      eventsContainer.innerHTML += card;

    }

  } catch (error) {

    console.error(error);

  }

}

// INIT
loadPlans();

// SEARCH FILTER
searchInput.addEventListener(
  "input",
  applyFilters
);

// FILTER BUTTONS
filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    // RESET
    filterButtons.forEach((btn) => {

      btn.classList.remove(
        "bg-[#081C35]",
        "text-white"
      );

      btn.classList.add(
        "bg-white",
        "text-[#0B1F3A]"
      );

    });

    // ACTIVE
    button.classList.remove(
      "bg-white",
      "text-[#0B1F3A]"
    );

    button.classList.add(
      "bg-[#081C35]",
      "text-white"
    );

    // SAVE FILTER
    currentFilter =
      button.dataset.filter;

    // APPLY
    applyFilters();

  });

});