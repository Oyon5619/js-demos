// 定义必要得变量
var snakeBody = [] // 蛇身体数组
var direction // 蛇的移动方向
var pause // 是否暂停
var gameTimer // 游戏定时器
var score, timer, food, view // 分数 定时器 食物 主屏幕

// 定义一些常量
const
  VIEW_WIDTH = 600, // 主屏幕宽度
  VIEW_HEIGHT = 600, // 主屏幕高度
  SNAKE_SIZE = 15, // 蛇关节大小
  DELAY = 95, // 延时
  INITIAL_SNAKE_BODY_LEN = 3 // 蛇的初始长度


// 游戏初始化
window.onload = function init() {
  // 获取必要的元素
  view = document.querySelector('.view')
  score = document.querySelector('.score-value')

  // 初始化蛇的移动方向为 right pause为false
  direction = 'right'
  pause = false

  createSnake()
  createFood()
  watchKey()
}

// 创建贪吃蛇
function createSnake() {
  for (let i = 0; i < INITIAL_SNAKE_BODY_LEN; ++i) {
    let snake = document.createElement('div') // 蛇的每个身体部位都是div
    // 设置蛇头颜色
    if (i == 0) {
      snake.style.background = '#ff0'
    }
    snake.style.left = (INITIAL_SNAKE_BODY_LEN - i - 1) * SNAKE_SIZE + 'px' // 设置好每个身体的样式
    snakeBody.push(snake) // 推入数组
    view.appendChild(snake) // 显示在主屏幕
  }
}

// 创建贪吃蛇吃的食物
function createFood() {
  if (food) {
    view.removeChild(food)
  }

  food = document.createElement('span')
  // 食物的xy坐标
  let foodX = null, foodY = null

  do {
    // 600px被等分成40个宽15px的食物
    foodX = Math.floor(Math.random()*(VIEW_WIDTH/SNAKE_SIZE))*SNAKE_SIZE
    foodY = Math.floor(Math.random()*(VIEW_HEIGHT/SNAKE_SIZE))*SNAKE_SIZE
    // console.log(`generate food: ${foodX},${foodY}`)
  } while (judge(foodX,foodY))

  // 判断生成的坐标是否与蛇身产生冲突
  function judge(x,y) {
    for (let i = 0; i < snakeBody.length; ++i) {
      if (snakeBody[i].offserLeft === x && snakeBody[i].offserTop === y) {
        return true
      }
    }
    return false
  }

  // 设置食物的位置
  food.style.left = foodX + 'px'
  food.style.top = foodY + 'px'
  
  // 将食物显示在主屏幕中
  view.appendChild(food)
}

// 键盘监听(上下左右键)
function watchKey() {
  document.addEventListener('keydown', (event) => {
    let evt = event || window.event // 兼容性
    // console.log(evt)
    switch (evt.keyCode) {
      // ENTER -> GAME START
      case 13:
        gameStart()
        break
      // 左箭头
      case 37:
        if (direction !== 'right') {
          direction = 'left'
        }
        break
      // 上箭头
      case 38:
        if (direction !== 'down') {
          direction = 'up'
        }
        break
      // 右箭头
      case 39:
        if (direction !== 'left') {
          direction = 'right'
        }
        break
      // 下箭头
      case 40:
        if (direction !== 'up') {
          direction = 'down'
        }
        break
      // SPACE
      case 32:
        if (pause) gameStart()
        else gamePause()
        pause = !pause
        break
    }
  })
}

// 蛇身移动
function snakeMove() {
  let snakeX = snakeBody[0].offsetLeft, snakeY = snakeBody[0].offsetTop
  // 判断当前移动方向 以及判断是否越界
  switch (direction) {
    case 'up':
      if (snakeY <= 0) {
        gg()
        return
      }
      moveSnakeBody()
      snakeBody[0].style.top = snakeY - SNAKE_SIZE + 'px'
      break
    case 'down':
      if (snakeY >= VIEW_HEIGHT - SNAKE_SIZE) {
        gg()
        return
      }
      moveSnakeBody()
      snakeBody[0].style.top = snakeY + SNAKE_SIZE + 'px'
      break
    case 'left':
      if (snakeX <= 0) {
        gg()
        return
      }
      moveSnakeBody()
      snakeBody[0].style.left = snakeX - SNAKE_SIZE + 'px'
      break
    case 'right':
      if (snakeX >= VIEW_WIDTH - SNAKE_SIZE) {
        gg()
        return
      }
      moveSnakeBody()
      snakeBody[0].style.left = snakeX + SNAKE_SIZE + 'px'
      break
  }

  // 蛇身数组位置移动
  function moveSnakeBody() {
    // 关节坐标顶替
    for (let i = snakeBody.length - 1; i > 0; --i) {
      snakeBody[i].style.left = snakeBody[i-1].style.left
      snakeBody[i].style.top = snakeBody[i-1].style.top
    }
  }
}

// 蛇有没有伤害到自己
function snakeHit() {
  // 遍历蛇身数组
  for (let i = 1; i < snakeBody.length; ++i) {
    // 如果伤到自己了 返回true
    if (snakeBody[0].offsetLeft === snakeBody[i].offsetLeft 
      && snakeBody[0].offsetTop === snakeBody[i].offsetTop) {
      return true
    }
  }
  return false // 说明没伤到自己
}

// 蛇吃食物
function eatFood() {
  if (snakeBody[0].offsetLeft === food.offsetLeft 
    && snakeBody[0].offsetTop === food.offsetTop) {
    // 分数变更
    score.innerText = parseInt(score.innerText) + 1
    // 创建新的蛇身体关节
    var newBody = document.createElement('div')
    newBody.style.left = food.style.left
    newBody.style.top = food.style.top

    snakeBody.push(newBody) // 把新身体推入蛇身数组
    view.appendChild(newBody) // 把新身体展示在主屏幕中

    // 再生成一个新的食物
    createFood()
  }
}

// 游戏启动
function gameStart() {
  // 把旧的定时器清除
  clearInterval(gameTimer)
  // 创建新的定时器
  gameTimer = setInterval(() => {
    snakeMove() // 移动蛇
    if(snakeHit()) { // 判断是否撞到自己
      gg() // 游戏结束
    }
    eatFood() // 蛇吃食物
  }, DELAY)
}

// 暂停游戏
function gamePause() {
  // 清空定时器
  clearInterval(gameTimer)
}

// 重新开始游戏
function gameRestart() {
  // 重置页面
  location.reload()
}

// 游戏结束
function gg() {
  // 清空定时器
  clearInterval(gameTimer)
  // 重置页面
  location.reload()
  // 弹窗
  alert('GAME OVER!')
  alert(`Your score: ${score.innerText}`)
}