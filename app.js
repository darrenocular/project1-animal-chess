/*----- CONSTANTS -----*/
const PLAYERS = ["blue", "red"];

const ANIMAL_POWERS = {
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

const START_POSITIONS = {
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
const currentPositions = {
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

const currentAnimalsPower = {
  blue: {
    elephant: 8,
    lion: 7,
    tiger: 6,
    leopard: 5,
    wolf: 4,
    dog: 3,
    cat: 2,
    rat: 1,
  },
  red: {
    elephant: 8,
    lion: 7,
    tiger: 6,
    leopard: 5,
    wolf: 4,
    dog: 3,
    cat: 2,
    rat: 1,
  },
};

/*----- CACHED ELEMENTS -----*/
const gameboard = document.querySelector("#gameboard");
const currentPlayerDisplay = document.querySelector("#current-player");
let currentPlayer;
let currentPiece;
let opponent;
let winner;

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

  // Set current player
  currentPlayer = PLAYERS[0];
  opponent = PLAYERS[1];
  currentPlayerDisplay.innerText = currentPlayer;
  currentPlayerDisplay.className = "blue-player";

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
      square.innerHTML = `<img src="${IMAGE_LINKS.trap}" class="blue square-img trap" />`;
    } else if (BOARD_CONFIG["red"]["trap"].includes(square.id)) {
      square.innerHTML = `<img src="${IMAGE_LINKS.trap}" class="red square-img trap" />`;
    }
  }
}

// Render dens
function renderDens() {
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    if (BOARD_CONFIG["blue"]["den"] === square.id) {
      square.innerHTML = `<img src="${IMAGE_LINKS.den}" class="blue square-img den" />`;
    } else if (BOARD_CONFIG["red"]["den"] === square.id) {
      square.innerHTML = `<img src="${IMAGE_LINKS.den}" class="red square-img den" />`;
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
  const squares = document.querySelectorAll(".square");

  for (const square of squares) {
    if (Object.values(START_POSITIONS.blue).includes(square.id)) {
      const animal = getKeyByValue(START_POSITIONS.blue, square.id);
      square.innerHTML = `<img src="${IMAGE_LINKS[animal]}" class="piece blue-piece" data-animal="${animal}" />`;
    } else if (Object.values(START_POSITIONS.red).includes(square.id)) {
      const animal = getKeyByValue(START_POSITIONS.red, square.id);
      square.innerHTML = `<img src="${IMAGE_LINKS[animal]}" class="piece red-piece" data-animal="${animal}" />`;
    }
  }
}

// Handle click
function handleClick(e) {
  const squares = document.querySelectorAll(".square");

  // Remove all highlights (if any)
  for (const square of squares) {
    square.style.removeProperty("background-color");
    square.classList.remove("highlight");
  }

  // Ensure player can only click their own pieces
  if (checkOwnPiece(e)) {
    const availableMoves = checkAvailableMoves(e);
    highlightAvailableMoves(availableMoves);
  }

  // To be used for handleMove() below
  currentPiece = e.target;
}

// Handle move
function handleMove(e) {
  // Move piece
  let destinationSquareId;
  let destinationSquare;
  if (e.target.tagName === "IMG") {
    destinationSquare = e.target.parentElement;
    destinationSquareId = e.target.parentElement.id;
  } else {
    destinationSquare = e.target;
    destinationSquareId = e.target.id;
  }

  if (destinationSquare.hasChildNodes()) {
    // Opponent piece not in den
    if (destinationSquare.firstElementChild.classList.contains("piece")) {
      const opponentPiece = destinationSquare.firstElementChild;
      const opponentPanel = document.querySelector(
        `.${opponent}-player.player-panel`
      );
      opponentPanel.append(opponentPiece);
      destinationSquare.append(currentPiece);

      // Update current position of opponent piece that was eaten
      currentPositions[opponent][opponentPiece.dataset.animal] = "";
    } else if (
      destinationSquare.firstElementChild.classList.contains("den") ||
      destinationSquare.firstElementChild.classList.contains("trap")
    ) {
      // Opponent piece in trap
      if (destinationSquare.children.length > 1) {
        const opponentPiece = destinationSquare.children[1];
        const opponentPanel = document.querySelector(
          `.${opponent}-player.player-panel`
        );
        opponentPanel.append(opponentPiece);
        destinationSquare.firstElementChild.style.display = "none"; // if destination piece is den or trap
        destinationSquare.append(currentPiece);

        // Update current position of opponent piece that was eaten
        currentPositions[opponent][opponentPiece.dataset.animal] = "";
      } else {
        destinationSquare.firstElementChild.style.display = "none"; // if destination piece is den or trap
        currentPiece.parentElement.firstElementChild.style.display =
          "inline-block";
        destinationSquare.append(currentPiece);
      }
    }
  } else {
    // If exiting from trap
    if (
      currentPiece.parentElement.firstElementChild.classList.contains("trap")
    ) {
      currentPiece.parentElement.firstElementChild.style.display =
        "inline-block";
    }
    destinationSquare.append(currentPiece);
  }

  // Clear highlighted squares
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    square.style.removeProperty("background-color");
    square.classList.remove("highlight");
  }

  // Update current position of player piece
  currentPositions[currentPlayer][currentPiece.dataset.animal] =
    destinationSquareId;

  // Check if current player's animal moved into opponent's traps
  if (checkTrap()) {
    currentAnimalsPower[currentPlayer][currentPiece.dataset.animal] = 0;
  } else {
    currentAnimalsPower[currentPlayer][currentPiece.dataset.animal] =
      ANIMAL_POWERS[currentPiece.dataset.animal];
  }

  // Check if winner
  let winner = checkBoardForWin();
  if (winner) {
    handleWin();
  } else {
    toggleCurrentPlayer();
  }

  // Reduce power (if enter opponent's trap)
  function checkTrap() {
    const opponentTraps = BOARD_CONFIG[opponent].trap;

    for (const position of Object.values(currentPositions[currentPlayer])) {
      if (opponentTraps.includes(position)) {
        return true;
      }
    }
    return false;
  }
}

// Check if own piece
function checkOwnPiece(e) {
  if (e.target.tagName === "IMG") {
    if (
      Object.values(currentPositions[currentPlayer]).includes(
        e.target.parentNode.id
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

// Check available moves
function checkAvailableMoves(e) {
  const currentAnimal = e.target.dataset.animal;
  const currentRow = currentPositions[currentPlayer][currentAnimal][0]; // "a"
  const currentCol = Number(currentPositions[currentPlayer][currentAnimal][1]); // "1"
  let availableMoves = [];

  // Insert all availableMoves
  if (currentRow === "a" && currentCol === 1) {
    availableMoves.push("a2", "b1");
  } else if (currentRow === "a" && currentCol === 7) {
    availableMoves.push("a6", "b7");
  } else if (currentRow === "i" && currentCol === 1) {
    availableMoves.push("h1", "i2");
  } else if (currentRow === "i" && currentCol === 7) {
    availableMoves.push("h7", "i6");
  } else if (currentRow === "a") {
    availableMoves.push(
      currentRow + String(currentCol - 1),
      String.fromCharCode(currentRow.charCodeAt(0) + 1) + String(currentCol),
      currentRow + String(currentCol + 1)
    );
  } else if (currentRow === "i") {
    availableMoves.push(
      currentRow + String(currentCol - 1),
      String.fromCharCode(currentRow.charCodeAt(0) - 1) + String(currentCol),
      currentRow + String(currentCol + 1)
    );
  } else if (currentCol === 1) {
    availableMoves.push(
      String.fromCharCode(currentRow.charCodeAt(0) - 1) + String(currentCol),
      currentRow + String(currentCol + 1),
      String.fromCharCode(currentRow.charCodeAt(0) + 1) + String(currentCol)
    );
  } else if (currentCol === 7) {
    availableMoves.push(
      String.fromCharCode(currentRow.charCodeAt(0) - 1) + String(currentCol),
      currentRow + String(currentCol - 1),
      String.fromCharCode(currentRow.charCodeAt(0) + 1) + String(currentCol)
    );
  } else {
    availableMoves.push(
      String.fromCharCode(currentRow.charCodeAt(0) - 1) + String(currentCol),
      currentRow + String(currentCol + 1),
      String.fromCharCode(currentRow.charCodeAt(0) + 1) + String(currentCol),
      currentRow + String(currentCol - 1)
    );
  }

  // Check if own piece occupying availableMoves
  availableMoves = availableMoves.filter(
    (move) => !Object.values(currentPositions[currentPlayer]).includes(move)
  );

  // Check if availableMoves contains river
  // If not rat, remove river squares from availableMoves
  if (currentAnimal !== "rat") {
    const river = BOARD_CONFIG.river;

    availableMoves = availableMoves.filter((move) => !river.includes(move));
    // If lion or tiger, add available squares to jump to to availableMoves
    if (currentAnimal === "lion" || currentAnimal === "tiger") {
      availableMoves = [
        ...availableMoves,
        ...availableJumps(currentRow, currentCol), // if not by river, should be []
      ];
    }
  }

  // Check if availableMoves contains den of current player
  availableMoves = availableMoves.filter(
    (move) => move !== BOARD_CONFIG[currentPlayer].den
  );

  //   Filter out opponent pieces that cannot be captured from availableMoves
  availableMoves = availableMoves.filter((move) => {
    const moveSquare = document.querySelector(`#${move}`);
    if (
      moveSquare.hasChildNodes() &&
      moveSquare.firstElementChild.classList.contains("piece")
    ) {
      const opponentAnimal = moveSquare.firstElementChild.dataset.animal;
      if (currentAnimal === "rat" && opponentAnimal === "elephant") {
        return true;
      } else if (currentAnimal === "rat" && opponentAnimal === "rat") {
        return true;
      } else if (currentAnimal === "elephant" && opponentAnimal === "rat") {
        return false;
      } else {
        return currentAnimalsPower[currentPlayer][currentAnimal] >=
          currentAnimalsPower[opponent][opponentAnimal]
          ? true
          : false;
      }
    } else {
      return true;
    }
  });

  // Rat cannot kill from river
  if (e.target.parentElement.classList.contains("river")) {
    availableMoves = availableMoves.filter((move) => {
      const moveSquare = document.querySelector(`#${move}`);
      if (
        moveSquare.hasChildNodes() &&
        moveSquare.firstElementChild.classList.contains("piece") &&
        moveSquare.firstElementChild.dataset.animal !== "rat"
      ) {
        return false;
      } else {
        return true;
      }
    });
  }

  // Obtain array of available squares to jump to
  function availableJumps(row, col) {
    const availableJumps = [];
    const ratPositions = [currentPositions.blue.rat, currentPositions.red.rat];

    // Vertical jumps
    if (![1, 4, 7].includes(col)) {
      // Check if rat in intervening vertical squares
      for (const position of ratPositions) {
        if (position[1] == col && ["d", "e", "f"].includes(position[0])) {
          return availableJumps;
        }
      }

      switch (row) {
        case "c":
          availableJumps.push("g" + String(col));
          break;
        case "g":
          availableJumps.push("c" + String(col));
          break;
      }
    }

    // Horizontal jumps
    if (["d", "e", "f"].includes(row)) {
      switch (col) {
        case 1:
          for (const position of ratPositions) {
            if (position[0] === row && [2, 3].includes(Number(position[1]))) {
              return availableJumps;
            }
          }
          availableJumps.push(row + "4");
          break;
        case 7:
          // Check if rat in intervening horizontal squares
          for (const position of ratPositions) {
            if (position[0] === row && [5, 6].includes(Number(position[1]))) {
              return availableJumps;
            }
          }
          availableJumps.push(row + "4");
          break;
        case 4:
          for (const position of ratPositions) {
            if (
              position[0] === row &&
              [2, 3, 5, 6].includes(Number(position[1]))
            ) {
              return availableJumps;
            }
          }
          availableJumps.push(row + "1", row + "7");
          break;
      }
    }
    return availableJumps;
  }

  // Return available moves
  return availableMoves;
}

// Highlight available moves
function highlightAvailableMoves(arr) {
  const squares = document.querySelectorAll(".square");
  for (const square of squares) {
    if (arr.includes(square.id)) {
      square.classList.add("highlight");
      square.style.backgroundColor = "rgb(255, 255, 110)";
    }
  }
}

// Check board for win
function checkBoardForWin() {
  if (
    Object.values(currentPositions.blue).includes("a4") ||
    Object.values(currentPositions.red).includes("i4") ||
    Object.values(currentPositions.blue).every((position) => position === "") ||
    Object.values(currentPositions.red).every((position) => position === "")
  ) {
    return currentPlayer;
  }
}

// Toggle current player display
function toggleCurrentPlayer() {
  if (currentPlayer === PLAYERS[0]) {
    currentPlayer = PLAYERS[1];
    opponent = PLAYERS[0];
    currentPlayerDisplay.innerHTML = currentPlayer;
    currentPlayerDisplay.className = "red-player";
  } else {
    currentPlayer = PLAYERS[0];
    opponent = PLAYERS[1];
    currentPlayerDisplay.innerHTML = currentPlayer;
    currentPlayerDisplay.className = "blue-player";
  }
}

// Toggle rules
function toggleRules() {
  const rulesPopup = document.querySelector("#rules");

  setTimeout(() => {
    if (rulesPopup.hidden === true) {
      rulesPopup.hidden = false;
      document.body.style.overflow = "hidden";
    } else {
      rulesPopup.hidden = true;
      document.body.style.overflow = "auto";
    }
  }, 50); // Ensures closeRules runs first before toggleRules when button is clicked
}

// Close rules
function closeRules(e) {
  const isClosest = e.target.closest("#rules");
  const rulesPopup = document.querySelector("#rules");

  if (
    !isClosest &&
    !rulesPopup.hidden &&
    e.target !== document.querySelector(".rules-btn")
  ) {
    rulesPopup.hidden = true;
    document.body.style.overflow = "auto";
  }
}

// Handle win
function handleWin() {
  document.querySelector(
    "#info-panel"
  ).innerHTML = `<h2>Congratulations! <span class="${currentPlayer}-player" id="current-player">${currentPlayer}</span> has won! 🎉</h2>`;
  gameboard.style.pointerEvents = "none";
}

// Get key by value (reusable)
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

/*----- EVENT LISTENERS -----*/
// On load
document.addEventListener("DOMContentLoaded", renderBoard);

// Toggle rules
document.querySelector(".rules-btn").addEventListener("click", toggleRules);
document
  .querySelector("#rules-header > button")
  .addEventListener("click", toggleRules);
document.addEventListener("click", (e) => closeRules(e)); // Close popup if click outside of popup

// Start new game
document
  .querySelector(".restart-btn")
  .addEventListener("DOMContentLoaded", renderBoard);

// Handle clicks
document.querySelector("#gameboard").addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("highlight") &&
    !e.target.parentElement.classList.contains("highlight")
  )
    handleClick(e);
});

// To move clicked piece
document.querySelector("#gameboard").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("highlight") ||
    e.target.parentElement.classList.contains("highlight")
  )
    handleMove(e);
});
