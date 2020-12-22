let width;
let height;
let tileSize;
let canvas;
let ctx;
let interval;
let fps;
let food;
let snake;
let score;
let isPaused;

//loading the browser window
window.addEventListener("load", function(){

    game();

});

//Add event listener for arrow key presses
window.addEventListener("keydown", function (evt) {
    if (evt.key === " ") {
        evt.preventDefault();
        isPaused = !isPaused;
        showPaused();
    }
    else if (evt.key === "ArrowUp") {
        evt.preventDefault();
        if (snake.velY != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
        snake.dir(0, -1);
    }
    else if (evt.key === "ArrowDown") {
        evt.preventDefault();
        if (snake.velY != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
        snake.dir(0, 1);
    }

    else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        if (snake.velX != 1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
        snake.dir(-1, 0);
    }

    else if (evt.key === "ArrowRight") {
        evt.preventDefault();
        if (snake.velX != -1 && snake.x >= 0 && snake.x <= width && snake.y >= 0 && snake.y <= height)
        snake.dir(1, 0);
    }
});


//Determine a random spawn location on the grid
function spawnLocation() {

    //Breaking the entire canvas into a grid of tiles
    let rows = width / tileSize;
    let cols = height / tileSize;

    let xPos, yPos;

    xPos = Math.floor(Math.random() * rows) * tileSize;
    yPos = Math.floor(Math.random() * cols) * tileSize;

    return { x: xPos, y: yPos};

}

//show the score to player
function showScore() {

    ctx.textAlign = "center";
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE" + score, width - 120, 30);
}

//showing if game is paused
function showPaused() {

    ctx.textAlign = "center";
    ctx.font = "35px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED", width / 2, height / 2);
}

//Treat snake like object
class Snake{

    //Initialize object properties
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.tail = [{ x: pos.x - tileSize, y: pos.y }, { x: pos.x - tileSize * 2, y: pos.y }];
        this.velX = 1;
        this.velY = 0;
        this.color = color;
    }

    //drawing snake on canvas
    draw() {

        //drawing head of snake
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        //drawing tail of snake
        for (var i = 0; i < this.tail.length; i++) {
            ctx.beginPath();
            ctx.rect(this.tail[i].x, this.tail[i].y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        }
    }
    //Moving snake by updating postion
    move() {

        //Movement of tail
        for (var i = this.tail.length - 1; i > 0; i--) {

            this.tail[i] = this.tail[i -1];
        }

        //updating start of tail to acquire position of head
        if (this.tail.length != 0)
        this.tail[0] = { x: this.x, y: this.y };

        //movement of head
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;
    }
    //change direction of movement of the snake
    dir(dirX, dirY) {
        
        this.velX = dirX;
        this.velY = dirY;
    }

    //determine if snake has eaten a piece of food
    eat() {

        if(Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize) {

            //adding to tail
            this.tail.push({});
            return true;
        }

        return false;
    }

    //checking if snake has died
    die() {

        for (var i = 0; i < this.tail.length; i++) {

            if (Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize) {
                return true;
            }
        }

        return false;
    }

    border() {

        if(this.x + tileSize > width && this.velX != -1 || this.x < 0 && this.velX != 1) this.x = width - this.x;

        else if (this.y + tileSize > height && this.velY != -1 || this.velY != 1 && this.y < 0) this.y = height - this.y;
    }

}

//Treating the food as an object
class Food {
    //Initialization of the object properties
    // pos is position
    constructor(pos, color) {

        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
    }

    //drawing the food on the canvas
draw() {
    ctx.beginPath()
    ctx.rect(this.x, this.y, tileSize, tileSize)
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    }
}

// Initialization of the game objects.
function init() {

    tileSize = 20;

    //Dynamically controlling the size of canvas. Will work no matter the size of your screen. 
    //This creates a grid with tite size set above to 20
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerWidth / tileSize);

    fps = 10;

    canvas = document.getElementById("game-area"); //named game-area in HTML
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d"); //sets the context of the canvas; we've made our game 2D meaning it has x,y coordinates 

    isPaused = false;
    score = 0;

    snake = new Snake({ x: tileSize * Math.floor(width / (2 * tileSize)), y: tileSize* Math.floor(height / (2 * tileSize)) }, "#9400D3");

    food = new Food(spawnLocation(), "HotPink");
}

//Update the position and redrawing of game objects
function update() {

    if(isPaused){
        return;
    }

    if (snake.die()) {
        alert("GAME OVER");
        clearInterval(interval);
        window.location.reload();
    }

    snake.border();

    if (snake.eat()) {
        score += 10;
        food = new Food(spawnLocation(), "HotPink");
    }

    //clearing the canvas for redrawing
    ctx.clearRect(0, 0, width, height);

    //recreates whole game with food, snake, snake movement
    food.draw();
    snake.draw();
    snake.move();
    showScore();
}

//actual game function
function game() {

    init();

    //the game loop, how often does it run and update the code, frames per second
    interval = setInterval(update, 500/fps);
}
