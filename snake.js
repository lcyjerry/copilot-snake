// 游戏设置
let canvas = document.getElementById("game"); // 获取游戏画布
let context = canvas.getContext("2d"); // 获取2D渲染上下文

let score = 0; // 初始化得分为0

let box = 32; // 设置游戏中的单位大小

// 计算canvas的中心位置
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

// 计算按钮的宽度和高度
let buttonWidth = 6 * box;
let buttonHeight = 2 * box;

// 绘制一个圆角矩形作为按钮
context.beginPath();
context.roundRect(
  centerX - buttonWidth / 2, // 按钮的x坐标
  centerY - buttonHeight / 2, // 按钮的y坐标
  buttonWidth,
  buttonHeight,
  0.5 * box
);
context.fillStyle = "#4CAF50"; // 按钮颜色
context.fill();
context.lineWidth = box / 4;
context.strokeStyle = "#FFFFFF"; // 边框颜色
context.stroke();
context.closePath();

// 计算文字的宽度和高度
let text = "Start Game";
let textWidth = context.measureText(text).width;
let textHeight = 30; // 这是你设置的字体大小

// 绘制按钮上的文字
context.fillStyle = "white";
context.font = textHeight + "px Arial";
context.textAlign = "center"; // 设置文本对齐方式为中心
context.textBaseline = "middle"; // 设置文本基线为中心
context.fillText(text, centerX, centerY);

let obstacles = [generateObstacle(), generateObstacle(), generateObstacle()]; // 生成障碍物
let snake = []; // 初始化蛇
snake[0] = { x: 8 * box, y: 8 * box }; // 蛇的初始位置

let direction = "RIGHT"; // 蛇的初始方向

let food = {
  // 食物的初始位置
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box,
};

// 绘制游戏
function drawGame() {
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box); // 绘制游戏背景

  // 绘制障碍物
  for (let i = 0; i < obstacles.length; i++) {
    context.fillStyle = "blue";
    context.fillRect(obstacles[i].x, obstacles[i].y, box, box);
  }

  // 绘制蛇
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i == 0 ? "green" : "white"; // 蛇头颜色为绿色，蛇身颜色为白色
    context.fillRect(snake[i].x, snake[i].y, box, box);

    context.strokeStyle = "red"; // 蛇的边框颜色为红色
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 绘制食物
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);

  // 蛇的移动
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "RIGHT") snakeX += box;
  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "DOWN") snakeY += box;

  // 如果蛇穿过边界，让它从另一边返回
  if (snakeX < 0) snakeX = 15 * box;
  if (snakeX > 15 * box) snakeX = 0;
  if (snakeY < 0) snakeY = 15 * box;
  if (snakeY > 15 * box) snakeY = 0;

  // 判断蛇是否吃到食物
  if (snakeX != food.x || snakeY != food.y) {
    snake.pop(); // 没有吃到食物，蛇移动一格
  } else {
    // 吃到食物，生成新的食物，得分加1
    food = generateObstacle();
    score++;
  }

  // 显示分数
  context.fillStyle = "white";
  context.font = "45px Changa one";
  context.fillText(score, 2 * box, 1.6 * box);

  // 新的蛇头位置
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 判断游戏结束条件
  if (collision(newHead, snake) || collision(newHead, obstacles)) {
    clearInterval(game); // 游戏结束，清除定时器

    // 延时1秒后重置游戏状态并重新开始游戏
    setTimeout(function () {
      // 重置游戏状态
      snake = [{ x: 9 * box, y: 10 * box }]; // 重置蛇的位置
      direction = "RIGHT"; // 重置蛇的方向
      score = 0; // 重置分数

      // 重新开始游戏
      game = setInterval(drawGame, 100);
    }, 1000);
  }

  snake.unshift(newHead); // 新的蛇头添加到蛇的头部
}

// 检查碰撞
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    let dx = head.x + box / 2 - (array[i].x + box / 2);
    let dy = head.y + box / 2 - (array[i].y + box / 2);
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < box) {
      return true; // 发生碰撞
    }
  }
  return false; // 没有发生碰撞
}

function generateRandomPosition() {
  return {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
  };
}

// 生成障碍物
function generateObstacle() {
  return {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box,
  };
}

// 控制方向
document.addEventListener("keydown", directionControl);

function directionControl(event) {
  let key = event.keyCode;
  if (key == 37 && direction != "RIGHT") {
    direction = "LEFT";
  } else if (key == 38 && direction != "DOWN") {
    direction = "UP";
  } else if (key == 39 && direction != "LEFT") {
    direction = "RIGHT";
  } else if (key == 40 && direction != "UP") {
    direction = "DOWN";
  }
}

let startButton = document.getElementById("start-button"); // 获取开始按钮
let game; // 游戏定时器
let gameover = false; // 用来标记游戏是否结束

// 点击开始按钮开始游戏
canvas.addEventListener("click", function (event) {
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  if (
    x > centerX - 3 * box &&
    x < centerX + 3 * box &&
    y > centerY - box &&
    y < centerY + box
  ) {
    game = setInterval(drawGame, 100); // 开始游戏，每100ms执行一次drawGame函数
  }
});
