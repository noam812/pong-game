// variables
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;
let playerWidth = 10;
let playerHeight = 100;
let playerVelocityY = 0;
let player1Score = 0;
let player2Score = 0;

// players
let player1 = {
  x: 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

let player2 = {
  x: boardWidth - playerWidth - 10,
  y: boardHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

// ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 1,
  velocityY: 2,
};

// functions
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); // used to render 2D shapes

  requestAnimationFrame(update); // initiates the animation
  document.addEventListener("keydown", movePlayer);
  document.addEventListener("keyup", stopPlayer);
};

// update loop function that is called every frame
function update() {
  requestAnimationFrame(update); // requestAnimationFrame is a function that tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint
  context.clearRect(0, 0, boardWidth, boardHeight); // Clear the board

  // update players
  context.fillStyle = "skyblue";
  let nextPlayer1Y = player1.y + player1.velocityY;
  // if the next position of the player is not out of bounds, update the player's position
  if (!outOfBounds(nextPlayer1Y)) {
    player1.y = nextPlayer1Y;
  }
  context.fillRect(player1.x, player1.y, player1.width, player1.height);
  let nextPlayer2Y = player2.y + player2.velocityY;
  if (!outOfBounds(nextPlayer2Y)) {
    player2.y = nextPlayer2Y;
  }
  context.fillRect(player2.x, player2.y, player2.width, player2.height);

  // update ball
  context.fillStyle = "red";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // if the ball hits the top or bottom of the board, reverse the direction of the ball
  if (ball.y + ball.height > boardHeight || ball.y < 0) {
    ball.velocityY *= -1; // reverse the direction of the ball
  }
  // if the ball hits one of the players, reverse the direction of the ball
  if (
    (ball.velocityX < 0 && detectCollision(ball, player1)) ||
    (ball.velocityX > 0 && detectCollision(ball, player2))
  ) {
    if (ball.velocityX < 4 && ball.velocityX > -4) {
      ball.velocityX *= -1.1;
      console.log(`ball.velocityX: ${ball.velocityX}`);
      // } else if (ball.velocityY < 4 && ball.velocityY > -4) {
      //   ball.velocityY *= -1.1;
    } else {
      console.log(`ball.velocityX maxed at:  ${ball.velocityX}`);
      ball.velocityX *= -1;
    }
  }

  // if the ball goes out of bounds, reset the ball and update the score
  if (ball.x < 0) {
    player2Score++;
    //reset the ball and switch the direction
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ball.velocityX = 1;
    ball.velocityY = 2;
  }
  if (ball.x > boardWidth) {
    player1Score++;
    ball.x = boardWidth / 2;
    ball.y = boardHeight / 2;
    ball.velocityX = -1;
    ball.velocityY = 2;
  }
  // draw the score
  context.font = "45px sans-serif";
  context.fillText(player1Score, boardWidth / 5, 45);
  context.fillText(player2Score, (boardWidth * 4) / 5 - 45, 45);

  // draw dotted line
  for (let i = 0; i < boardHeight; i += 30) {
    context.fillRect(boardWidth / 2 - 5, i, 10, 20);
  }
}

function outOfBounds(yPosition) {
  return yPosition < 0 || yPosition + playerHeight > boardHeight; // if the yPosition is less than 0 or greater than the boardHeight, return true
}

function movePlayer(event) {
  switch (event.key) {
    case "w":
      player1.velocityY = -5;
      break;
    case "s":
      player1.velocityY = 5;
      break;
    case "ArrowUp":
      player2.velocityY = -5;
      break;
    case "ArrowDown":
      player2.velocityY = 5;
      break;
  }
}

function stopPlayer(event) {
  switch (event.key) {
    case "w":
    case "s":
      player1.velocityY = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
      player2.velocityY = 0;
      break;
  }
}

function detectCollision(ball, player) {
  return (
    ball.x < player.x + player.width && // if the ball is to the left of the right edge of the player
    ball.x + ball.width > player.x && // if the ball is to the right of the left edge of the player
    ball.y < player.y + player.height && // if the ball is above the bottom edge of the player
    ball.y + ball.height > player.y // if the ball is below the top edge of the player
  );
}
