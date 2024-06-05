class Lives {
  lives;

  constructor() {
    this.lives = START_LIVES;
    this.showLives();
  }

  removeLife() {
    this.lives--;
    this.showLives();
  }

  showLives() {
    document.getElementById("lives-info").innerText = `Życia: ${this.lives}`;
  }

  isDead() {
    if (this.lives <= 0) {
      return true;
    }
    return false;
  }
}
