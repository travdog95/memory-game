//DOM Elements
const modal = document.querySelector(".modal-container");
const modalTitle = document.querySelector(".modal-title");
const gameOptionsButtons = document.querySelectorAll(".new-game-content ul li");
const gameBoard = document.querySelector(".game-board");
const birthdayPresent = document.querySelector(".birthday-present");
const message = document.querySelector(".message");

//Global variables
let boardLocked = false;
let game = {};

const pics = {
  1: "Remi-1.jpg",
  2: "Remi-2.jpg",
  3: "Remi-3.jpg",
  4: "Remi-4.jpg",
  5: "Remi-5.jpg",
  6: "Remi-6.jpg",
  7: "Remi-7.jpg",
  8: "Remi-8.png",
};

//functions
const init = () => {
  game = new Game({
    id: 1,
    options: {
      theme: "numbers",
      "num-players": 1,
      "grid-size": "4x4",
    },
    numTiles: 16,
    firstChoice: {},
    secondChoice: {},
    players: [],
    timeElapased: 0,
    matchesFound: 0,
  });

  gameBoard.innerHTML = "";
  document.querySelector(".num-moves").innerHTML = 0;
  document.querySelector(".score").innerHTML = 0;
  birthdayPresent.classList.add("hidden");
  birthdayPresent.classList.remove("fade-in");
  message.classList.remove("blinking");
  message.innerHTML = "";

  game.numTiles = game.options["grid-size"] == "4x4" ? 16 : 64;
  let tileValues = [];

  //Determine board tiles
  if (game.options.theme == "numbers") {
    let tileValue = 1;

    //add values to array
    for (let i = 0; i < game.numTiles; i++) {
      tileValues.push(tileValue);
      if (i % 2 === 1) tileValue++;
    }
    //Randomize array
    tileValues = shuffleArray(tileValues);
  }

  //Draw Board
  let html = "";
  //Add tiles to game board
  for (let j = 0; j < game.numTiles; j++) {
    html += `
      <div data-position="${j + 1}" data-value="${tileValues[j]}" class="tile active">
        <div class="tile-inner">
          <div class="tile-front"></div>
          <div class="tile-back"><img src="./images/${pics[tileValues[j]]}" alt="Remi" /></div>
        </div>
      </div>
    `;
  }

  let p = 1;
  for (p; p <= game.options["num-players"]; p++) {
    game.players.push(new Player({ id: p, name: `Player ${p}` }));
  }

  // console.log(game);
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
      if (boardLocked == false) {
        this.classList.add("flipped");
        processTileClick(tile, this);
      }
    });
  });
};

const processTileClick = async (tile, tileElement) => {
  //Set first choice and exit
  if (Object.keys(game.firstChoice).length === 0) {
    game.firstChoice = {
      position: tile.dataset.position,
      value: tile.dataset.value,
    };
    return;
  }

  //Second choice
  if (Object.keys(game.firstChoice).length > 0 && Object.keys(game.secondChoice).length === 0) {
    //Don't allow any more clicks on game board
    boardLocked = true;

    //Increment number of moves
    game.players[0].numMoves++;
    document.querySelector(".num-moves").innerHTML = game.players[0].numMoves;

    //Set second choice
    game.secondChoice = {
      position: tile.dataset.position,
      value: tile.dataset.value,
    };

    //Determine if there's a match
    if (game.firstChoice.value === game.secondChoice.value) {
      //Increase player score
      game.players[0].score++;
      game.matchesFound++;
      document.querySelector(".score").innerHTML = game.players[0].score;

      //Game completed
      if (game.matchesFound === game.numTiles / 2) {
        console.log("game over");

        message.innerHTML = "Well done!";
        // message.classList.add("blinking");

        // const wait = await delay(5000);

        // birthdayPresent.classList.remove("hidden");
        // birthdayPresent.classList.add("fade-in");
      }
    } else {
      //Delay 2 seconds
      const wait = await delay(2000);

      //turn tiles over
      tileElement.classList.remove("flipped"); //Second choice
      document
        .querySelector(`[data-position='${game.firstChoice.position}']`)
        .classList.remove("flipped"); //First choice

      //Go to next player, if applicable
    }

    //Clear choices
    game.firstChoice = "";
    game.secondChoice = "";

    //Unlock game board
    boardLocked = false;
  }
};

const delay = (miliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(miliseconds);
    }, miliseconds);
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
    game.options[groupName] = optionValue;
  });
});

//Reset game
document.getElementById("restartGameButton").addEventListener("click", (event) => {
  init();
});

document.getElementById("backToGameButton").addEventListener("click", (event) => {
  init();
});

init();
