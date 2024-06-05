class Mark extends FallingObject {
  radius;
  value;

  constructor(markImage) {
    const x = Math.random() * (WIDTH - MARK_RADIUS * 2);

    super(x, 0, MARK_SPEED);

    this.radius = MARK_RADIUS;
    this.value = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
  }

  detectCollision(colider) {
    if (
      colider.x < this.x + this.radius * 2 &&
      colider.x + colider.width > this.x &&
      colider.y < this.y + this.radius * 2 &&
      colider.height + colider.y > this.y
    ) {
      return true;
    }
    return false;
  }

  draw(context) {
    context.drawImage(
      markImages[this.value - 3],
      this.x + this.radius,
      this.y + this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
