let canvas;
let context;

let player;

let obstacles = [];
let marks = [];
let lastTime = Date.now();
let lastMarkTime = Date.now();
let points = 0;
let lives = 3;
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

function initPlayer() {
  player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 72,
    width: 70,
    height: 70,
    dx: 0,
  };
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

function drawPlayer() {
  context.drawImage(
    playerImage,
    player.x,
    player.y,
    player.width,
    player.height
  );
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    context.drawImage(
      obstacleImage,
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  });
}

function drawMarks() {
  marks.forEach((mark) => {
    context.drawImage(
      markImages[mark.value - 3],
      mark.x + mark.radius,
      mark.y + mark.radius,
      mark.radius * 2,
      mark.radius * 2
    );
  });
}

function movePlayer() {
  player.x += player.dx;

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.y += OBSTACLE_SPEED;
  });
}

function moveMarks() {
  marks.forEach((mark) => {
    mark.y += MARK_SPEED;
  });
}

function generateObstacle() {
  const width = 200;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: 0, width, height: 20 });
}

function generateMark() {
  const radius = 15;
  const x = Math.random() * (canvas.width - radius * 2);
  const value = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
  marks.push({ x, y: 0, radius: radius, value: value });
}

function detectCollision() {
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.height + player.y > obs.y
    ) {
      lives--;
      document.getElementById("lives-info").innerText = `Życia: ${lives}`;
      obstacles.splice(i, 1);
      if (lives <= 0) {
        // alert("Game Over");
        document.location.reload();
      } else {
        // initPlayer();
      }
      return true;
    }
  }
  return false;
}

function detectCollectingMark() {
  let returnedPoints = 0;
  let collectedPoints = [];

  for (let i = 0; i < marks.length; i++) {
    let mark = marks[i];
    if (
      player.x < mark.x + mark.radius * 2 &&
      player.x + player.width > mark.x &&
      player.y < mark.y + mark.radius * 2 &&
      player.height + player.y > mark.y
    ) {
      collectedPoints.push(mark.value);
      returnedPoints += mark.value;
      marks.splice(i, 1);
      i--;
    }
  }
  if (collectedPoints.length > 0) {
    const pointsInfo = document.getElementById("points-info");
    pointsInfo.innerText = `+ ${collectedPoints.join(", ")}`;

    setTimeout(() => {
      pointsInfo.innerText = "";
    }, 2000);
  }
  return returnedPoints;
}

function showBackround() {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}
function update() {
  if (isPaused) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveObstacles();
  moveMarks();

  showBackround();
  drawPlayer();
  drawObstacles();
  drawMarks();

  if (detectCollision() && lives <= 0) {
    alert("Game Over");
    document.location.reload();
    return;
  }

  points += detectCollectingMark();

  document.getElementById("points").innerText = points;
  document.getElementById("lives-info").innerText = `Życia: ${lives}`;

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
  } else if (event.code === "Escape") {
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
  initPlayer();
  update();
}
