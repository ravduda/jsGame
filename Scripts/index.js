let canvas;
let context;

let player;

let obstacles = [];
let marks = [];
let additionalLives = [];
let lastTime = Date.now();
let lastMarkTime = Date.now();
let lastAdditionalLifeTime = Date.now();
let points;
let lives;
let isPaused = false;
let backgroundImage;
let playerImage;
let obstacleImage;
let markImages;
let lifeImage;
let startScreenImage;
let gameOverImage;
let pouseStartTime = 0;
let gameStartTime;
let isGameOver;
let hasGameStarted = false;

function initCanvas() {
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  document.body.appendChild(canvas);
}

function initImages() {
  backgroundImage = new Image();
  backgroundImage.src = "Images/background2.png";
  playerImage = new Image();
  playerImage.src = "Images/usiolek.png";
  obstacleImage = new Image();
  obstacleImage.src = "Images/obstacle.png";
  lifeImage = new Image();
  lifeImage.src = "Images/life.png";
  startScreenImage = new Image();
  startScreenImage.src = "Images/startScreen.png";
  gameOverImage = new Image();
  gameOverImage.src = "Images/gameOver.png";

  let mark3Image = new Image();
  mark3Image.src = "Images/3.png";
  let mark4Image = new Image();
  mark4Image.src = "Images/4.png";
  let mark5Image = new Image();
  mark5Image.src = "Images/5.png";

  markImages = [mark3Image, mark4Image, mark5Image];
}

function moveAndDrawFallingObjects() {
  obstacles.forEach((obstacle) => {
    obstacle.move();
    obstacle.draw(context);
  });

  marks.forEach((mark) => {
    mark.move();
    mark.draw(context);
  });

  additionalLives.forEach((life) => {
    life.move();
    life.draw(context);
  });
}

function generateObstacle() {
  obstacles.push(new Obstacle());
}

function generateMark() {
  marks.push(new Mark());
}

function generateAdditionalLife() {
  additionalLives.push(new AdditionalLife());
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

  // Additional life collision
  for (let i = 0; i < additionalLives.length; i++) {
    let life = additionalLives[i];
    if (life.detectCollision(player)) {
      additionalLives.splice(i, 1);
      i--;

      lives.addLife();
    }
  }
}

function showBackround() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function getDificulty() {
  let currentTime = Date.now();
  let timeDiff = currentTime - gameStartTime;
  return 1 + timeDiff / 50000;
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  showBackround();
  if (isGameOver) {
    context.drawImage(gameOverImage, 150, 75, 300, 150);
    return;
  }

  if (!hasGameStarted) {
    context.drawImage(startScreenImage, 150, 75, 300, 150);
  }

  if (!isPaused) player.movePlayer();
  player.drawPlayer(context);
  moveAndDrawFallingObjects();

  checkCollisions();

  if (lives.isDead()) {
    isGameOver = true;
  }

  let currentTime = Date.now();
  let pouseTime;

  if (pouseStartTime > 0) Date.now() - pouseStartTime;
  else pouseTime = 0;

  if (currentTime - lastTime + pouseTime > INTERVAL / getDificulty()) {
    generateObstacle();
    lastTime = currentTime;
  }

  if (currentTime - lastMarkTime + pouseTime > MARK_INTERVAL) {
    generateMark();
    lastMarkTime = currentTime;
  }

  if (
    currentTime - lastAdditionalLifeTime + pouseTime >
    ADDITIONAL_LIFE_INTERVAL
  ) {
    generateAdditionalLife();
    lastAdditionalLifeTime = currentTime;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.y < canvas.height);
  marks = marks.filter((mark) => mark.y < canvas.height);
  additionalLives = additionalLives.filter((life) => life.y < canvas.height);

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = PLAYER_SPEED;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -PLAYER_SPEED;
  } else if (e.code === "Escape") {
    if (!hasGameStarted) return;
    isPaused = !isPaused;
    pouseStartTime = Date.now();
    if (!isPaused) {
      pouseStartTime = 0;
      update();
    }
  } else if (e.code === "Space") {
    if (isGameOver || !hasGameStarted) {
      loadGame();
      hasGameStarted = true;
      isPaused = false;
      pouseStartTime = 0;

      isGameOver = false;
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

function loadGame() {
  lives = new Lives();
  player = new Player(playerImage);
  points = new Points();
  obstacles = [];
  marks = [];
  additionalLives = [];
  lastTime = Date.now();
  lastMarkTime = Date.now();
  gameStartTime = Date.now();
  lastAdditionalLifeTime = Date.now();
  isGameOver = false;
  isPaused = true;
  pouseStartTime = Date.now();

  update();
}

function main() {
  initCanvas();
  initImages();
  loadGame();
}
