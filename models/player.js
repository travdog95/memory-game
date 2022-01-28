class Player {
  constructor(playerData) {
    this.id = playerData.id;
    this.name = playerData.name;
    this.score = playerData.score === undefined ? 0 : playerData.score;
    this.numMoves = playerData.numMoves === undefined ? 0 : playerData.numMoves;
  }
}
