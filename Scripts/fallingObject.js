class FallingObject {
  x;
  y;
  speed; // in pixels per second
  lastUpdateTime;

  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.lastUpdateTime = Date.now();
  }

  move() {
    let currentTime = Date.now();
    let deltaTime = currentTime - this.lastUpdateTime;
    this.y += (this.speed * deltaTime) / 1000;
    this.lastUpdateTime = currentTime;
  }
}
