class Points {
  points;

  constructor() {
    this.points = 0;
    this.showPoints();
  }

  addPoints(collectedPoints) {
    this.points += collectedPoints;

    const pointsInfo = document.getElementById("points-info");
    pointsInfo.innerText = `+ ${collectedPoints}`;

    this.showPoints();
  }

  showPoints() {
    document.getElementById("points").innerText = `Punkty: ${this.points}`;
  }
}
