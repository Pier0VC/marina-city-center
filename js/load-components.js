// LOAD NAVBAR
async function loadNavbar() {

  // TARGET
  const navbarContainer =
    document.getElementById("navbarContainer");

  // EXISTS
  if (!navbarContainer) return;

  // FETCH HTML
  const response =
    await fetch("./components/navbar.html");

  // HTML
  const html =
    await response.text();

  // INSERT
  navbarContainer.innerHTML =
    html;

  // RELOAD ICONS
  lucide.createIcons();

}

// INIT
loadNavbar();