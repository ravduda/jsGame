let canvas;
let context;

let player;

let obstacles = [];
let marks = [];
let lastTime = Date.now();
let lastMarkTime = Date.now();
let points = 0;
let lives = 3;

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
    y: canvas.height - 32,
    width: 30,
    height: 30,
    dx: 0,
  };
}

function drawPlayer() {
  context.fillStyle = "#0095DE";
  context.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  context.fillStyle = "#FF0000";
  obstacles.forEach((obstacle) => {
    context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawMarks() {
  context.fillStyle = "#00FF00";
  marks.forEach((mark) => {
    context.beginPath();
    context.arc(
      mark.x + mark.radius,
      mark.y + mark.radius,
      mark.radius,
      0,
      Math.PI * 2
    );
    context.fill();
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
  const width = canvas.width / 3;
  const x = Math.random() * (canvas.width - width);
  obstacles.push({ x, y: 0, width, height: 20 });
}

function generateMark() {
  const radius = 10;
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
      lives--; // Zmniejsz liczbę żyć
      document.getElementById("lives-info").innerText = `Życia: ${lives}`;
      if (lives <= 0) {
        alert("Game Over");
        document.location.reload();
      } else {
        // Restartowanie pozycji gracza po kolizji
        initPlayer();
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

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveObstacles();
  moveMarks();

  drawPlayer();
  drawObstacles();
  drawMarks();

  if (detectCollision()) {
    //alert("Game Over");
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

  requestAnimationFrame(update);
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = PLAYER_SPEED;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -PLAYER_SPEED;
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
