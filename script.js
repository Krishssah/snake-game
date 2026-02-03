const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, food, direction, score, speed, game;

// Sounds
const eatSound = new Audio("sounds/eat.mp3");
const hitSound = new Audio("sounds/hit.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");

// High Score
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = highScore;

// Start / Restart
document.getElementById("startBtn").addEventListener("click", initGame);

// Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function initGame() {
  snake = [{ x: 9 * box, y: 9 * box }];
  direction = "RIGHT";
  score = 0;
  speed = 140;
  food = randomFood();

  document.getElementById("score").innerText = score;

  clearInterval(game);
  game = setInterval(draw, speed);
}

// Draw watermark
function drawBackgroundText() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.font = "bold 64px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("KRISH", canvas.width / 2, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackgroundText();

  // Draw snake (smooth circles)
  snake.forEach((seg, i) => {
    ctx.beginPath();
    ctx.arc(
      seg.x + box / 2,
      seg.y + box / 2,
      box / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#00cc99";
    ctx.fill();

    // Write HOD on snake
    const text = "HOD";
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      text[i % text.length],
      seg.x + box / 2,
      seg.y + box / 2
    );
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    eatSound.play();
    document.getElementById("score").innerText = score;
    food = randomFood();

    speed = Math.max(60, speed - 5);
    clearInterval(game);
    game = setInterval(draw, speed);
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Collision
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    hitSound.play();
    gameOverSound.play();
    clearInterval(game);
    updateHighScore();
    alert("Game Over!");
    return;
  }

  snake.unshift(newHead);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

function collision(head, body) {
  return body.some(seg => seg.x === head.x && seg.y === head.y);
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").innerText = highScore;
  }
}
