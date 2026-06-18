const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const generatedMenu = document.querySelector("#generated-menu");
const changeMenuButton = document.querySelector("#change-menu-button");
const overlay = document.querySelector("#overlay");
const exitPopup = document.querySelector("#exit-popup");
const closePopupButton = document.querySelector("#close-popup-button");
const photoGrid = document.querySelector("#photo-grid");

const mainCourses = [
  "Filet de turbot de la mer Noire",
  "Tablier de sapeur",
  "Gigot d'agneau",
  "Faisan de forêt",
  "Trio de quinoa, chou kale et pousses d'épinard",
];
const techniques = [
  "à la cocotte",
  "minute",
  "avec sa sauce hollandaise",
  "façon sud-ouest",
  "comme chez ma grand-mère",
  "déglacé au saké",
  "maturé en fût de chêne",
];
const sides = [
  "une purée de topinambour",
  "ses frites truffées",
  "des châtaignes croustillantes",
  "une brunoise carotte-cèleri",
  "un oeuf parfait",
  "sa crème veloutée de fromages affinés",
];
const seasonings = [
  "au yuzu rouge",
  "au poivre vert de Sichuan",
  "et une pointe de safran",
  "à l'ail noir",
  "et un peu de sucre en poudre",
];

const getRandom = (data) => data[Math.floor(Math.random() * data.length)];

let popupAlreadyShown = false;
let draggedCard = null;

function showTab(tabName) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function generateMenu() {
  const menu = `${getRandom(mainCourses)} ${getRandom(techniques)}, avec ${getRandom(sides)} ${getRandom(seasonings)}`;
  generatedMenu.textContent = menu;
}

function showPopup() {
  if (popupAlreadyShown) {
    return;
  }

  popupAlreadyShown = true;
  overlay.hidden = false;
  exitPopup.hidden = false;
}

function closePopup() {
  overlay.hidden = true;
  exitPopup.hidden = true;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showTab(button.dataset.tab);
  });
});

changeMenuButton.addEventListener("click", generateMenu);

document.addEventListener("mouseout", (event) => {
  if (event.clientY <= 0 && !event.relatedTarget) {
    showPopup();
  }
});

closePopupButton.addEventListener("click", closePopup);
overlay.addEventListener("click", closePopup);

photoGrid.addEventListener("dragstart", (event) => {
  const card = event.target.closest(".photo-card");

  if (!card) {
    return;
  }

  draggedCard = card;
  card.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
});

photoGrid.addEventListener("dragover", (event) => {
  event.preventDefault();

  if (!draggedCard) {
    return;
  }

  const targetCard = event.target.closest(".photo-card");

  if (!targetCard || targetCard === draggedCard) {
    return;
  }

  const cards = [...photoGrid.querySelectorAll(".photo-card")];
  const draggedIndex = cards.indexOf(draggedCard);
  const targetIndex = cards.indexOf(targetCard);

  if (draggedIndex < targetIndex) {
    photoGrid.insertBefore(draggedCard, targetCard.nextSibling);
  } else {
    photoGrid.insertBefore(draggedCard, targetCard);
  }
});

photoGrid.addEventListener("dragenter", (event) => {
  const card = event.target.closest(".photo-card");

  if (card && card !== draggedCard) {
    card.classList.add("drag-over");
  }
});

photoGrid.addEventListener("dragleave", (event) => {
  const card = event.target.closest(".photo-card");

  if (card) {
    card.classList.remove("drag-over");
  }
});

photoGrid.addEventListener("dragend", () => {
  if (draggedCard) {
    draggedCard.classList.remove("dragging");
  }

  photoGrid.querySelectorAll(".drag-over").forEach((card) => {
    card.classList.remove("drag-over");
  });
  draggedCard = null;
});

generateMenu();
