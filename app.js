// 1) Define required constants
// 2) Define required variables used to track the state of the game
// 3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant.
// 4) Upon loading the app should:
//   4.1) Initialize the state variables
//   4.2) Render those values to the page
//   4.3) Wait for the user to click a square
// 5) Handle a player clicking a square
// 6) Handle a player clicking the replay button

/*----- CONSTANTS -----*/
const ANIMALS = {
  elephant: 8,
  lion: 7,
  tiger: 6,
  leopard: 5,
  wolf: 4,
  dog: 3,
  cat: 2,
  rat: 1,
};

const BOARD_CONFIG = {
  blue: {
    trap: ["h4", "i3", "i5"],
    den: "i4",
  },
  red: {
    trap: ["b4", "a3", "a5"],
    den: "a4",
  },
  river: [
    "d2",
    "d3",
    "d5",
    "d6",
    "e2",
    "e3",
    "e5",
    "e6",
    "f2",
    "f3",
    "f5",
    "f6",
  ],
};

const START_POSITION = {
  blue: {
    elephant: "g1",
    lion: "i7",
    tiger: "i1",
    leopard: "g5",
    wolf: "g3",
    dog: "h6",
    cat: "h2",
    rat: "g7",
  },
  red: {
    elephant: "c7",
    lion: "a1",
    tiger: "a7",
    leopard: "c3",
    wolf: "c5",
    dog: "b2",
    cat: "b6",
    rat: "c1",
  },
};

const IMAGE_LINKS = {
  trap: "assets/trap.png",
  den: "assets/den.png",
  elephant: "assets/elephant.png",
  lion: "assets/lion.png",
  tiger: "assets/tiger.png",
  leopard: "assets/leopard.png",
  wolf: "assets/wolf.png",
  dog: "assets/dog.png",
  cat: "assets/cat.png",
  rat: "assets/rat.png",
};

/*----- STATE VARIABLES -----*/

/*----- CACHED ELEMENTS -----*/
const gameboard = document.querySelector("#gameboard");
const currentPlayerDisplay = document.querySelector("#current-player");

/*----- FUNCTIONS -----*/
// Render board
function renderBoard() {
  // Create 63 squares using a for loop
  for (let i = 0; i < 63; i++) {
    const newSquare = document.createElement("div");

    // Add a class of "square" to each square
    newSquare.classList.add("square");

    // Add an id of "[row][col]" to each square
    const col = (i % 7) + 1;
    let row = String.fromCharCode("a".charCodeAt(0) + Math.floor(i / 7));
    newSquare.id = `${row}${col}`;

    // Append each square to gameboard
    gameboard.append(newSquare);
  }

  renderTraps();
  renderDens();
  renderRiver();
  renderPieces();
}

// Render traps
function renderTraps() {
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    if (BOARD_CONFIG["blue"]["trap"].includes(square.id)) {
      square.innerHTML = `<img src="${IMAGE_LINKS.trap}" class="blue square-img" />`;
    } else if (BOARD_CONFIG["red"]["trap"].includes(square.id)) {
      square.innerHTML = `<img src="${IMAGE_LINKS.trap}" class="red square-img" />`;
    }
  }
}

// Render dens
function renderDens() {
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    if (BOARD_CONFIG["blue"]["den"] === square.id) {
      square.innerHTML = `<img src="${IMAGE_LINKS.den}" class="blue square-img" />`;
    } else if (BOARD_CONFIG["red"]["den"] === square.id) {
      square.innerHTML = `<img src="${IMAGE_LINKS.den}" class="red square-img" />`;
    }
  }
}

// Render river
function renderRiver() {
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    if (BOARD_CONFIG["river"].includes(square.id)) {
      square.classList.add("river");
    }
  }
}

// Render pieces
function renderPieces() {
  const animalList = Object.keys(ANIMALS);
  const squares = document.querySelectorAll(".square");

  for (const square of squares) {
    if (Object.values(START_POSITION.blue).includes(square.id)) {
      const animal = getKeyByValue(START_POSITION.blue, square.id);
      square.innerHTML = `<img src="${IMAGE_LINKS[animal]}" class="piece blue-piece" />`;
    } else if (Object.values(START_POSITION.red).includes(square.id)) {
      const animal = getKeyByValue(START_POSITION.red, square.id);
      square.innerHTML = `<img src="${IMAGE_LINKS[animal]}" class="piece red-piece" />`;
    }
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}

// Check board for win
function checkBoardForWin() {}

function toggleRules() {
  const rulesPopup = document.querySelector("#rules");

  if (rulesPopup.hidden === true) {
    rulesPopup.hidden = false;

    // Fade out and disable surrounding elements
  } else {
    rulesPopup.hidden = true;
  }
}

/*----- EVENT LISTENERS -----*/
// On load
document.addEventListener("DOMContentLoaded", renderBoard);

// Toggle rules
document.querySelector(".rules-btn").addEventListener("click", toggleRules);
document
  .querySelector("#rules-header > button")
  .addEventListener("click", toggleRules);

// Start new game
document
  .querySelector(".restart-btn")
  .addEventListener("DOMContentLoaded", renderBoard);
