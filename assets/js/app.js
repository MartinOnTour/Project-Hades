let canvas = document.getElementById("gol-canvas");

let startButton = document.getElementById("gol-start-button");
let pauseButton = document.getElementById("gol-pause-button"); 
let resetButton = document.getElementById("gol-reset-button");
let checkGOL = document.getElementById("project-link");

let interval;
const intervalTime = 350;
const fieldWidth = 15;

let intervalFunc = function () {
   game.calcNextStates();
   grid.drawRectByArray(game.gameField, State.colorCode);
   if (game.ended) {
       pauseGame();
   }
}

let startGame = function(){
    interval = setInterval(intervalFunc, intervalTime);        
}

let pauseGame = function() {
    clearInterval(interval);
}

let resetGame = function() {   
    pauseGame(); 
    game.reset();
    grid.drawRectByArray(game.gameField, State.colorCode);
}

canvas.addEventListener('click', function (event) {
    let index = grid.getIndexByPos(event.offsetX, event.offsetY);

    switch (game.gameField[index.x][index.y]) {
        case State.alive:            
            game.gameField[index.x][index.y] = State.dead;
            break;
        case State.dead:
            game.gameField[index.x][index.y] = State.alive;
            break;    
        default:
            console.log("Unexpected fields value");
            break;
    }

    grid.clear();
    grid.drawRectByArray(game.gameField, State.colorCode);
});

checkGOL.addEventListener('click', startGame);

// startButton.addEventListener('click', startGame);
// pauseButton.addEventListener('click', pauseGame);
// resetButton.addEventListener('click', resetGame);

fitToContainer(canvas);

function fitToContainer(aCanvas){
    aCanvas.style.width='100%';
    aCanvas.style.height='100%';
    aCanvas.width  = aCanvas.offsetWidth;
    aCanvas.height = aCanvas.offsetHeight;
}

const grid = new Grid(canvas, fieldWidth);

const game = new GameOfLife(grid.getFieldCount(), StartSequence.rPentomino);


grid.drawRectByArray(game.gameField, State.colorCode);
