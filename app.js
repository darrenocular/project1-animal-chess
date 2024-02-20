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

/*----- STATE VARIABLES -----*/

/*----- CACHES ELEMENTS -----*/

/*----- FUNCTIONS -----*/
// Render board
function renderBoard() {}

// Check board for win
function checkBoardForWin() {}

/*----- EVENT LISTENERS -----*/
// Toggle rules
document.querySelector(".rules-btn").addEventListener("click", () => {
  const rulesPopup = document.querySelector("#rules");
  // Toggle rules
  if (rulesPopup.hidden === true) {
    rulesPopup.hidden = false;

    // Fade out and disable surrounding elements
  } else {
    rulesPopup.hidden = true;
  }
});
