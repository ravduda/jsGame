let canvas;
let context;

let player;

let obstacles = [];
let marks = [];
let lastTime = Date.now();
let lastMarkTime = Date.now();
let points;
let lives;
let isPaused = false;
let backgroundImage;
let playerImage;
let obstacleImage;
let markImages;

function initCanvas() {
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.appendChild(canvas);
}

function initImages() {
  backgroundImage = new Image();
  backgroundImage.src = "../Images/background2.png";
  playerImage = new Image();
  playerImage.src = "../Images/usiolek.png";
  obstacleImage = new Image();
  obstacleImage.src = "../Images/obstacle.png";

  let mark3Image = new Image();
  mark3Image.src = "../Images/3.png";
  let mark4Image = new Image();
  mark4Image.src = "../Images/4.png";
  let mark5Image = new Image();
  mark5Image.src = "../Images/5.png";

  markImages = [mark3Image, mark4Image, mark5Image];
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.draw(context);
  });
}

function drawMarks() {
  marks.forEach((mark) => {
    mark.draw(context);
  });
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.move();
  });
}

function moveMarks() {
  marks.forEach((mark) => {
    mark.move();
  });
}

function generateObstacle() {
  obstacles.push(new Obstacle());
}

function generateMark() {
  marks.push(new Mark());
}

function checkCollisions() {
  // Obstacles collision
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].detectCollision(player)) {
      obstacles.splice(i, 1);
      i--;

      lives.removeLife();
    }
  }

  // Marks collision
  for (let i = 0; i < marks.length; i++) {
    let mark = marks[i];
    if (mark.detectCollision(player)) {
      marks.splice(i, 1);
      i--;

      points.addPoints(mark.value);
    }
  }
}

function showBackround() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function update() {
  if (isPaused) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  showBackround();

  player.movePlayer();
  moveObstacles();
  moveMarks();

  player.drawPlayer(context);
  drawObstacles();
  drawMarks();

  checkCollisions();

  if (lives.isDead()) {
    alert("Game Over");
    document.location.reload();
    return;
  }

  let currentTime = Date.now();
  if (currentTime - lastTime > INTERVAL) {
    generateObstacle();
    lastTime = currentTime;
  }

  if (currentTime - lastMarkTime > MARK_INTERVAL) {
    generateMark();
    lastMarkTime = currentTime;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.y < canvas.height);
  marks = marks.filter((mark) => mark.y < canvas.height);

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = PLAYER_SPEED;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -PLAYER_SPEED;
  } else if (e.code === "Escape") {
    isPaused = !isPaused;
    if (!isPaused) {
      update();
    }
  }
}

function keyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    player.dx = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function main() {
  initCanvas();
  initImages();
  lives = new Lives();
  player = new Player(playerImage);
  points = new Points();
  update();
}
