class AdditionalLife extends FallingObject {
  width;
  height;

  constructor() {
    const x = Math.random() * (WIDTH - OBSTACLE_WIDTH);

    super(x, 0, LIFE_SPEED);

    this.width = LIFE_WIDTH;
    this.height = LIFE_HEIGHT;
  }

  detectCollision(colider) {
    if (
      colider.x < this.x + this.width &&
      colider.x + colider.width > this.x &&
      colider.y < this.y + this.height &&
      colider.height + colider.y > this.y
    ) {
      return true;
    }
    return false;
  }

  draw(context) {
    context.drawImage(lifeImage, this.x, this.y, this.width, this.height);
  }
}
