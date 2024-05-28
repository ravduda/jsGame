let canvas;
let context;

let player;

let obstacles = [];
let obstacleSpeed = 2;
let interval = 2000;
let lastTime = Date.now();

function initCanvas() {
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  canvas.width = 480;
  canvas.height = 320;
  document.body.appendChild(canvas);
}

function initPlayer() {
  player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
  };
}

function drawPlayer() {
  context.fillStyle = "#0095DD";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  context.fillStyle = "#FF0000";
  obstacles.forEach((obstacle) => {
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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
    obstacle.y += obstacleSpeed;
  });
}

function generateObstacle() {
  const width = Math.random() * (canvas.width / 2);
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: 0, width, height: 20 });
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
      return true;
    }
  }
  return false;
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveObstacles();

  drawPlayer();
  drawObstacles();

  if (detectCollision()) {
    alert("Game Over");
    document.location.reload();
  }

  let currentTime = Date.now();
  if (currentTime - lastTime > interval) {
    generateObstacle();
    lastTime = currentTime;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.y < canvas.height);

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -player.speed;
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
  initPlayer();
  update();
}
