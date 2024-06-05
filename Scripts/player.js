class Player {
  x;
  y;
  width;
  height;
  dx;
  playerImage;
  lastUpdateTime;

  constructor(playerImage) {
    this.x = WIDTH / 2 - PLAYER_WIDTH / 2;
    this.y = HEIGHT - PLAYER_HEIGHT;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.dx = 0;
    this.playerImage = playerImage;
    this.lastUpdateTime = Date.now();
  }

  drawPlayer(context) {
    context.drawImage(
      this.playerImage,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  movePlayer() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;

    this.x += (this.dx * deltaTime) / 1000;
    this.lastUpdateTime = currentTime;

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x + this.width > WIDTH) {
      this.x = WIDTH - this.width;
    }
  }
}
