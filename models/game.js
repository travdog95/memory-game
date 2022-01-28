class Game {
  constructor(gameData) {
    this.id = gameData.id;
    this.options = gameData.options;
    this.numTiles = gameData.numTiles;
    this.firstChoice = gameData.firstChoice === undefined ? {} : gameData.firstChoice;
    this.secondChoice = gameData.secondChoice === undefined ? {} : gameData.secondChoice;
    this.players = gameData.players === undefined ? [] : gameData.players;
    this.timeElapased = gameData.timeElapased === undefined ? 0 : gameData.timeElapased;
    this.matchesFound = gameData.matchesFound === undefined ? 0 : gameData.matchesFound;
  }
}
