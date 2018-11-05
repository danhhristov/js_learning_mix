var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const cell_width = (cell_height = 40);
const difficulties = {
  easy: 2.5,
  medium: 4,
  hard: 6
};

var timer = document.getElementById("timer");

var difficulty = "easy";
var timerInterval = null;
var startDate = null;

var cells = null;
var openedCells = 0;
var bombs = 0;
var markedBombs = 0;
var bombCount = document.getElementById("bombs");

class Cell {
  constructor(bomb, point) {
    this.bomb = bomb;
    this.bombCount = 0;
    this.isOpen = false;
    this.fImage = new Image(cell_width, cell_height);
    this.fImage.onload = function() {
      ctx.drawImage(this, point.x, point.y);
    };
    this.fImage.src = "/minesweeper/icons/back.png";
    this.bImage = new Image(cell_width, cell_height);
    this.bImage.onload = function() {
      ctx.drawImage(this, point.x, point.y);
    };
    this.point = point;
    this.markedBomb = false;
  }

  increaseBombCount() {
    this.bombCount++;
  }

  markAsBomb() {
    if (!this.isOpen) {
      markedBombs = markedBombs + (this.markedBomb ? -1 : 1);
      this.markedBomb = !this.markedBomb;
      this.bImage.src = this.markedBomb
        ? "/minesweeper/icons/flag.png"
        : "/minesweeper/icons/back.png";
      setBombCount();
    }
  }

  getBombCount() {
    return this.bombCount;
  }

  getPoint() {
    return this.point;
  }

  isBomb() {
    return this.bomb;
  }

  isOpen() {
    return this.isOpen;
  }

  showIcon() {
    this.bImage.src = this.bomb
      ? "/minesweeper/icons/mine.png"
      : "/minesweeper/icons/" + this.bombCount + ".png";
  }

  open() {
    if (!this.isOpen) {
      this.isOpen = true;
      openedCells++;
      this.bImage.src = this.bomb
        ? "/minesweeper/icons/mine.png"
        : "/minesweeper/icons/" + this.bombCount + ".png";
      if (this.bomb) {
        //game over :(
        stopTimer();
        showAllBombs();
        gameOver();
      } else if (this.bombCount == 0) {
        //open all neighbours which are not bombs
        openEmptyNeighbours(this.point);
      }
    }
  }
}

function openEmptyNeighbours(point) {
  const x = point.x / 40;
  const y = point.y / 40;
  if (cells[x - 1]) {
    if (cells[x - 1][y - 1] && !cells[x - 1][y - 1].isBomb())
      cells[x - 1][y - 1].open();
    if (cells[x - 1][y] && !cells[x - 1][y].isBomb()) cells[x - 1][y].open();
    if (cells[x - 1][y + 1] && !cells[x - 1][y + 1].isBomb())
      cells[x - 1][y + 1].open();
  }
  if (cells[x][y - 1] && !cells[x][y - 1].isBomb()) cells[x][y - 1].open();
  if (cells[x][y + 1] && !cells[x][y + 1].isBomb()) cells[x][y + 1].open();

  if (cells[x + 1]) {
    if (cells[x + 1][y - 1] && !cells[x + 1][y - 1].isBomb())
      cells[x + 1][y - 1].open();
    if (cells[x + 1][y] && !cells[x + 1][y].isBomb()) cells[x + 1][y].open();
    if (cells[x + 1][y + 1] && !cells[x + 1][y + 1].isBomb())
      cells[x + 1][y + 1].open();
  }
}

function gameOver() {
  clearBoundEvents();
  alert("You lose :(");
}

function gameWon() {
  clearBoundEvents();
  alert("You win :)");
}

function clearBoundEvents() {
  canvas.onmousedown = null;
}

function setBombCount() {
  bombCount.innerHTML = markedBombs;
}

function showAllBombs() {
  for (let i = 0; i < cells.length; i++) {
    for (cell of cells[i]) {
      if (cell.isBomb()) cell.showIcon();
    }
  }
}

function drawGrid() {
  for (let i = 0; i <= 9; i++) {
    let sx = i * cell_width;
    for (let j = 0; j <= 9; j++) {
      let sy = j * cell_height;
      let rnd = Math.random() * 10 + 1;
      let bomb = rnd < difficulties[difficulty];
      cells[i].push(new Cell(bomb, { x: sx, y: sy }));
      if (bomb) bombs++;
    }
  }
}

function calcMines(point) {
  const x = point.x;
  const y = point.y;
  if (cells[x - 1]) {
    if (cells[x - 1][y - 1] && cells[x - 1][y - 1].isBomb())
      cells[x][y].increaseBombCount();
    if (cells[x - 1][y] && cells[x - 1][y].isBomb())
      cells[x][y].increaseBombCount();
    if (cells[x - 1][y + 1] && cells[x - 1][y + 1].isBomb())
      cells[x][y].increaseBombCount();
  }
  if (cells[x][y - 1] && cells[x][y - 1].isBomb())
    cells[x][y].increaseBombCount();
  if (cells[x][y + 1] && cells[x][y + 1].isBomb())
    cells[x][y].increaseBombCount();

  if (cells[x + 1]) {
    if (cells[x + 1][y - 1] && cells[x + 1][y - 1].isBomb())
      cells[x][y].increaseBombCount();
    if (cells[x + 1][y] && cells[x + 1][y].isBomb())
      cells[x][y].increaseBombCount();
    if (cells[x + 1][y + 1] && cells[x + 1][y + 1].isBomb())
      cells[x][y].increaseBombCount();
  }
}

function initGame() {
  cells = [[], [], [], [], [], [], [], [], [], []];
  startDate = new Date();
  bombs = 0;
  markedBombs = 0;
  openedCells = 0;
  setBombCount();
  drawGrid();
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      calcMines({ x: i, y: j });
    }
  }
  initCanvasEvents();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedTime = (new Date() - startDate) / 1000;
    let secs =
      "" + (elapsedTime % 60 < 10 ? "0" : "") + Math.floor(elapsedTime % 60);
    let minutes = elapsedTime / 60;
    let mins = "" + (minutes % 60 < 10 ? "0" : "") + Math.floor(minutes);
    let hours = minutes / 60;
    let hs = "" + (hours % 60 < 10 ? "0" : "") + Math.floor(hours);
    timer.innerHTML = hs + ":" + mins + ":" + secs;
  }, 999);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function initCanvasEvents() {
  canvas.onmousedown = function(evt) {
    const padding = 46;
    const cellSize = 40;
    const x = Math.floor(
      (event.pageX - canvas.offsetLeft - padding) / cellSize
    );
    const y = Math.floor((event.pageY - canvas.offsetTop - padding) / cellSize);
    if (x < 0 || x > cells.length - 1 || y < 0 || y > cells.length - 1)
      return false;
    //get mouse button to determine left or right click
    const mouseClick = evt.button;
    const leftClick = 0;
    //   const rightClick = 2;
    if (mouseClick == leftClick) {
      cells[x][y].open();
      //Check if there are unopened cells
      if (openedCells + markedBombs >= 100 || openedCells + bombs >= 100) {
        stopTimer();
        gameWon();
      }
    } else {
      cells[x][y].markAsBomb();
    }
  };
}

function changeDifficulty(button) {
  difficulty = button.innerHTML.toLocaleLowerCase();
  initGame();
}
//Prevent context menu (right click)
document.addEventListener("contextmenu", event => event.preventDefault());
