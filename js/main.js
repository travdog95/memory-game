//DOM Elements
const modal = document.querySelector(".modal-container");
const modalTitle = document.querySelector(".modal-title");
const gameOptionsButtons = document.querySelectorAll(".new-game-content ul li");
const gameBoard = document.querySelector(".game-board");

let gameOptions = {
  theme: "numbers",
  "num-players": 1,
  "grid-size": "4x4",
};

//functions
const init = () => {
  const numTiles = gameOptions["grid-size"] == "4x4" ? 16 : 64;
  let tileValues = [];

  //Determine board tiles
  if (gameOptions.theme == "numbers") {
    let tileValue = 1;

    //add values to array
    for (let i = 0; i < numTiles; i++) {
      tileValues.push(tileValue);
      if (i % 2 === 1) tileValue++;
    }
    //Randomize array
    tileValues = shuffleArray(tileValues);
  }

  //Draw Board
  let html = "";
  //Add tiles to game board
  for (let j = 0; j < numTiles; j++) {
    html += `
      <div data-position="${j + 1}" data-value="${tileValues[j]}" class="tile active">
        <div class="tile-inner">
          <div class="tile-front"></div>
          <div class="tile-back">${tileValues[j]}</div>
        </div>
      </div>
    `;
  }

  gameBoard.innerHTML = html;

  tileHandlers();
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const tileHandlers = () => {
  const tiles = document.querySelectorAll(".tile.active");

  tiles.forEach((tile) => {
    tile.addEventListener("click", function (e) {
      this.classList.add("flipped");
    });
  });
};

//Event listener
document.getElementById("newGameButton").addEventListener("click", function (event) {
  modal.classList.remove("hidden");
  modal.classList.add("new-game");
  modalTitle.innerHTML = "New Game Settings";
});

document.querySelector(".modal-close").addEventListener("click", function (event) {
  modal.classList.add("hidden");
});

//New Game modal
gameOptionsButtons.forEach((gameOptionsButton) => {
  gameOptionsButton.addEventListener("click", function (event) {
    //Find other buttons in group and remove active classList
    const groupName = this.dataset.group;
    const group = document.querySelectorAll(`.${groupName}-btn`);

    group.forEach((btn) => {
      btn.classList.remove("active");
    });

    //Add active class to clicked buttons
    this.classList.add("active");

    //Save options
    const optionValue = this.dataset.optionValue;
    gameOptions[groupName] = optionValue;
  });
});

init();
