import {
  db,
  auth
} from "./firebase-config.js";

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
  document.getElementById("planDetailsContainer");

// URL PARAMS
const params =
  new URLSearchParams(window.location.search);

// PLAN ID
const planId =
  params.get("id");

// LOAD DETAILS
async function loadPlanDetails() {

  try {

    // VALIDATION
    if (!planId) {

      container.innerHTML = `

        <div class="flex items-center justify-center py-40">

          <p class="text-red-500 text-xl">
            Invalid plan ID
          </p>

        </div>

      `;

      return;

    }

    // PLAN REF
    const planRef =
      doc(db, "plans", planId);

    // PLAN SNAPSHOT
    const planSnap =
      await getDoc(planRef);

    // NOT FOUND
    if (!planSnap.exists()) {

      container.innerHTML = `

        <div class="flex items-center justify-center py-40">

          <p class="text-red-500 text-xl">
            Plan not found
          </p>

        </div>

      `;

      return;

    }

    // PLAN DATA
    const plan =
      planSnap.data();

    // CURRENT USER
    const currentUser =
      auth.currentUser;

    // OWNER
    const isOwner =
      currentUser &&
      currentUser.uid === plan.creatorId;

    // JOIN STATUS
    let joinStatus =
      "not_joined";

    // ATTENDEES
    let attendees =
      [];

    // PENDING REQUESTS
    let pendingRequests =
      [];

    // CHECK CURRENT USER JOIN
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

    // APPROVED ATTENDEES
    const attendeesQuery = query(
      collection(db, "planJoins"),
      where("planId", "==", planId),
      where("status", "==", "approved")
    );

    const attendeesSnapshot =
      await getDocs(attendeesQuery);

    attendeesSnapshot.forEach((docItem) => {

      attendees.push(
        docItem.data()
      );

    });

    // PENDING REQUESTS
    const pendingQuery = query(
      collection(db, "planJoins"),
      where("planId", "==", planId),
      where("status", "==", "pending")
    );

    const pendingSnapshot =
      await getDocs(pendingQuery);

    pendingSnapshot.forEach((docItem) => {

      pendingRequests.push({

        id:
          docItem.id,

        ...docItem.data()

      });

    });

    // ACTION BUTTON
    let actionButton = "";

    // OWNER
    if (isOwner) {

      actionButton = `

        <button
          onclick="deletePlan('${planId}')"
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
        >
          Delete Plan
        </button>

      `;

    }

    // PENDING
    else if (joinStatus === "pending") {

      actionButton = `

        <button
          class="bg-yellow-400 text-white px-6 py-4 rounded-2xl font-semibold cursor-default"
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
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
        >
          Open WhatsApp
        </a>

      `;

    }

    // NOT JOINED
    else {

      actionButton = `

        <button
          onclick="joinPlan('${planId}')"
          class="bg-[#5DA9E9] hover:bg-[#79bbf0] text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300"
        >
          Request Join
        </button>

      `;

    }

    // ATTENDEES HTML
    let attendeesHTML = "";

    // CREATOR
    attendeesHTML += `

      <div
        class="w-14 h-14 rounded-full bg-[#5DA9E9] border-4 border-white flex items-center justify-center text-white font-bold"
      >
        ${plan.creatorName.charAt(0)}
      </div>

    `;

    // ATTENDEES
    attendees.forEach((attendee) => {

      attendeesHTML += `

        <div
          class="w-14 h-14 rounded-full bg-[#0B1F3A] border-4 border-white flex items-center justify-center text-white font-bold"
          title="${attendee.userName}"
        >
          ${attendee.userName.charAt(0)}
        </div>

      `;

    });

    // PENDING HTML
    let pendingHTML = "";

    // OWNER ONLY
    if (isOwner && pendingRequests.length > 0) {

      pendingRequests.forEach((request) => {

        pendingHTML += `

          <div
            class="bg-[#F4F7FB] rounded-[28px] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
          >

            <!-- USER -->
            <div class="flex items-center gap-4">

              <!-- AVATAR -->
              <div
                class="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-lg"
              >
                ${request.userName.charAt(0)}
              </div>

              <!-- INFO -->
              <div>

                <h3
                  class="font-bold text-[#0B1F3A]"
                >
                  ${request.userName}
                </h3>

                <p
                  class="text-gray-400 text-sm"
                >
                  ${request.userApartment}
                </p>

              </div>

            </div>

            <!-- ACTIONS -->
            <div class="flex items-center gap-3">

              <!-- APPROVE -->
              <button
                onclick="approveRequest('${request.id}')"
                class="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                Approve
              </button>

              <!-- REJECT -->
              <button
                onclick="rejectRequest('${request.id}')"
                class="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                Reject
              </button>

            </div>

          </div>

        `;

      });

    }

    // RENDER
    container.innerHTML = `

      <!-- HERO -->
      <section class="relative">

        <!-- IMAGE -->
        <div class="relative h-[420px]">

          <img
            src="${plan.coverImage}"
            class="w-full h-full object-cover"
          >

          <!-- OVERLAY -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          ></div>

          <!-- BACK -->
          <button
            onclick="window.location.href='home.html'"
            class="absolute top-8 left-8 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 text-white text-2xl flex items-center justify-center"
          >
            ←
          </button>

          <!-- CONTENT -->
          <div
            class="absolute bottom-10 left-8 right-8"
          >

            <!-- LOCATION -->
            <div
              class="inline-flex bg-white/20 backdrop-blur-xl text-white px-5 py-2 rounded-full text-sm font-semibold border border-white/20 mb-5"
            >
              ${plan.location}
            </div>

            <!-- TITLE -->
            <h1
              class="text-white text-5xl font-bold mb-4"
            >
              ${plan.title}
            </h1>

            <!-- DATE -->
            <p
              class="text-white/80 text-lg"
            >
              ${plan.date} · ${plan.time}
            </p>

          </div>

        </div>

      </section>

      <!-- CONTENT -->
      <section class="px-6 -mt-14 relative z-20 pb-56">

        <!-- MAIN CARD -->
        <div
          class="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10"
        >

          <!-- TOP -->
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10"
          >

            <!-- CREATOR -->
            <div class="flex items-center gap-5">

              <div
                class="w-16 h-16 rounded-3xl bg-[#5DA9E9] flex items-center justify-center text-white text-2xl font-bold"
              >
                ${plan.creatorName.charAt(0)}
              </div>

              <div>

                <p
                  class="text-[#5DA9E9] font-semibold"
                >
                  Created by ${plan.creatorName}
                </p>

                <p
                  class="text-gray-400 text-sm"
                >
                  ${plan.creatorApartment}
                </p>

              </div>

            </div>

            <!-- ACTION -->
            <div class="flex items-center gap-4 flex-wrap">

              ${actionButton}

            </div>

          </div>

          <!-- DESCRIPTION -->
          <div class="mb-10">

            <h2
              class="text-2xl font-bold text-[#0B1F3A] mb-5"
            >
              About This Plan
            </h2>

            <p
              class="text-gray-500 leading-relaxed text-lg"
            >
              ${plan.description}
            </p>

          </div>

          <!-- ATTENDEES -->
          <div class="mb-10">

            <h2
              class="text-2xl font-bold text-[#0B1F3A] mb-6"
            >
              Community Attending
            </h2>

            <div class="flex items-center">

              <div class="flex -space-x-4">

                ${attendeesHTML}

              </div>

              <p
                class="ml-5 text-gray-400"
              >
                ${attendees.length + 1} residents attending
              </p>

            </div>

          </div>

          <!-- PENDING REQUESTS -->
          ${isOwner && pendingRequests.length > 0 ? `

            <div class="mt-10">

              <h2
                class="text-2xl font-bold text-[#0B1F3A] mb-6"
              >
                Pending Requests
              </h2>

              <div class="space-y-5">

                ${pendingHTML}

              </div>

            </div>

          ` : ""}

          <!-- DETAILS -->
          <div
            class="grid md:grid-cols-2 gap-6 mt-10"
          >

            <!-- CAPACITY -->
            <div
              class="bg-[#F4F7FB] rounded-[32px] p-8"
            >

              <p
                class="text-gray-400 mb-3"
              >
                Capacity
              </p>

              <h3
                class="text-4xl font-bold text-[#0B1F3A]"
              >
                ${plan.capacity || "Unlimited"}
              </h3>

            </div>

            <!-- LOCATION -->
            <div
              class="bg-[#F4F7FB] rounded-[32px] p-8"
            >

              <p
                class="text-gray-400 mb-3"
              >
                Location
              </p>

              <h3
                class="text-3xl font-bold text-[#0B1F3A]"
              >
                ${plan.location}
              </h3>

            </div>

          </div>

          <!-- RECOMMENDATIONS -->
          <div class="mt-10">

            <h2
              class="text-2xl font-bold text-[#0B1F3A] mb-5"
            >
              Recommendations
            </h2>

            <div
              class="bg-[#F4F7FB] rounded-[32px] p-8"
            >

              <p
                class="text-gray-500 leading-relaxed"
              >
                ${plan.recommendations || "No recommendations provided."}
              </p>

            </div>

          </div>

        </div>

      </section>

    `;

  } catch (error) {

    console.error(error);

    container.innerHTML = `

      <div class="flex items-center justify-center py-40">

        <p class="text-red-500 text-xl">
          Error loading plan
        </p>

      </div>

    `;

  }

}

// INIT
loadPlanDetails();