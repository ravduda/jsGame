class Obstacle extends FallingObject {
  width;
  height;

  constructor() {
    const x = Math.random() * (WIDTH - OBSTACLE_WIDTH);

    super(x, 0, OBSTACLE_SPEED);

    this.width = OBSTACLE_WIDTH;
    this.height = OBSTACLE_HEIGHT;
  }

  detectCollision(x, y, width, height) {
    if (
      x < this.x + this.width &&
      x + width > this.x &&
      y < this.y + this.height &&
      height + y > this.y
    ) {
      return true;
    }
    return false;
  }
}
