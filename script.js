// Some Problems on Level Design Requirement :
// 1. Apabila pindah level dan posisi obstacle tepat di kepala/badan, apakah mengurangi nyawa atau direset saja?

const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

var moveInterval = 120;

// Indikator untuk menunjukkan sekarang level berapa
var currLevel = 1;

// Array untuk desain level
const levelDesign = [
    // Level 1
    [],
    // level 2
    [
        // Setiap array digunakan untuk menunjukkan lokasi titik antar garis
        // Semisal jika hanya butuh untuk membuat 1 garis lurus, maka hanya perlu membuat 1 array dengan isi [x1,y1,x2,y2]
        // Jika ingin membuat 2 garis lurus, maka buat 2 array
        // Format : [x1,y1,x2,y2,...]
        [
            100, 210, 500, 210
        ]
    ],
    // level 3
    [
        [
            100, 210, 500, 210
        ],
        [
            100, 310, 500, 310
        ]
    ],
    // level 4
    [
        [
            100, 210, 500, 210
        ],
        [
            100, 310, 500, 310
        ],
        [
            100, 410, 500, 410
        ]
    ],
    // level 5
    [
        [
            90, 60, 90, 540
        ],
        [
            510, 60, 510, 540
        ]
    ]
]

function changeLevelDisplay() {
    document.getElementById('curr-level').innerHTML = currLevel
    document.getElementById('curr-speed').innerHTML = moveInterval
}

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{
        x: head.x,
        y: head.y
    }];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
    }
}
let snake1 = initSnake("purple");

let apples = [{
        color: "red",
        position: initPosition(),
    },
    {
        color: "green",
        position: initPosition(),
    }
]

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawObstacle(ctx) {
    ctx.beginPath();
    let levelDes = levelDesign[currLevel - 1];
    ctx.strokeStyle = 'black';
    for (let i = 0; i < levelDes.length; i++) {
        for (let j = 0; j < levelDes[i].length - 2; j += 2) {
            ctx.moveTo(levelDes[i][j], levelDes[i][j + 1]);
            ctx.lineTo(levelDes[i][j + 2], levelDes[i][j + 3]);
            ctx.lineWidth = CELL_SIZE;
            ctx.stroke();
        }
    }
}

function checkSnakeObstacleCol(snake) {
    let isCollide = false;
    let levelDes = levelDesign[currLevel - 1];
    for (let i = 0; i < levelDes.length; i++) {
        for (let j = 0; j < levelDes[i].length - 2; j += 2) {
            if (snake.head.x * CELL_SIZE + CELL_SIZE / 2 >= levelDes[i][j] &&
                snake.head.x * CELL_SIZE + CELL_SIZE / 2 <= levelDes[i][j + 2] &&
                snake.head.y * CELL_SIZE + CELL_SIZE / 2 >= levelDes[i][j + 1] &&
                snake.head.y * CELL_SIZE + CELL_SIZE / 2 <= levelDes[i][j + 3]) {
                console.log("Snake head x = " + snake.head.x)
                console.log("Snake head y = " + snake.head.y)
                // snake.body = [{
                //     x: snake.head.x,
                //     y: snake.head.y
                // }]
                gameOver();
                isCollide = true;
            }
        }
    }
    return isCollide;
}

// Kadang apel akan spawn di obstacle, maka dibuat function ini untuk mengecek lokasi apel apakah bertabrakan
function checkAppleObstacleCol(apple) {
    let levelDes = levelDesign[currLevel - 1];
    for (let i = 0; i < levelDes.length; i++) {
        for (let j = 0; j < levelDes[i].length - 2; j += 2) {
            if (apple.position.x * CELL_SIZE + CELL_SIZE / 2 >= levelDes[i][j] &&
                apple.position.x * CELL_SIZE + CELL_SIZE / 2 <= levelDes[i][j + 2] &&
                apple.position.y * CELL_SIZE + CELL_SIZE / 2 >= levelDes[i][j + 1] &&
                apple.position.y * CELL_SIZE + CELL_SIZE / 2 <= levelDes[i][j + 3]) {
                return true
            }
        }
    }
    return false
}

function draw() {
    initGame();
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawObstacle(ctx);
        drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }


        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        drawScore(snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            snake.score++;
            snake.body.push({
                x: snake.head.x,
                y: snake.head.y
            });
            if (snake.score % 5 == 0 && currLevel < 5) {
                var audio = new Audio('assets/sound/level-up.mp3');
                audio.play();
                alert(`Level ${currLevel} complete`);
                currLevel++;
                moveInterval -= 20;
                changeLevelDisplay();
                apples.forEach((e)=>{
                    if(checkAppleObstacleCol(e)){
                        do {
                            e.position = initPosition();
                        } while (checkAppleObstacleCol(e))
                    }
                })
            }
            do {
                apple.position = initPosition();
            } while (checkAppleObstacleCol(apple))
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

function checkCollision(snakes) {
    let isCollide = false;
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        gameOver();
    }
    return isCollide;
}

function gameOver() {
    var audio = new Audio('assets/sound/game-over.mp3');
    audio.play();

    alert("Game over");
    snake1 = initSnake("purple");
    changeLevelDisplay();
}

function move(snake) {
    console.log("Snake head x = " + snake.head.x)
    console.log("Snake head y = " + snake.head.y)
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);

    if (!checkCollision([snake1])) {
        setTimeout(function () {
            move(snake);
        }, moveInterval);
    } else {
        initGame();
    }

    if (!checkSnakeObstacleCol(snake1)) {

    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({
        x: snake.head.x,
        y: snake.head.y
    });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }

})

function initGame() {
    move(snake1);
    moveInterval = 120;
    currLevel = 1;
    changeLevelDisplay();
}