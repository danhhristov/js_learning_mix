var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const cell_width = (cell_height = 40);
const difficulties = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard"
};
const bombs = {
  easy: 10,
  medium: 25,
  hard: 50
};
var difficulty = difficulties.easy;

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
      this.markedBomb = !this.markedBomb;
      this.bImage.src = this.markedBomb
        ? "/minesweeper/icons/flag.png"
        : "/minesweeper/icons/back.png";
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
      this.bImage.src = this.bomb
        ? "/minesweeper/icons/mine.png"
        : "/minesweeper/icons/" + this.bombCount + ".png";
      if (this.bomb) {
        //game over :(
        alert("Game over");
        showAllBombs();
      }
    }
  }
}

function showAllBombs() {
  for (let i = 0; i < cells.length; i++) {
    for (cell of cells[i]) {
      if (cell.isBomb()) cell.showIcon();
    }
  }
}

var cells = [[], [], [], [], [], [], [], [], [], []];

function drawGrid() {
  for (let i = 0; i <= 9; i++) {
    let sx = i * cell_width;
    for (let j = 0; j <= 9; j++) {
      let sy = j * cell_height;
      let rnd = Math.random() * 10 + 1;
      cells[i].push(new Cell(rnd < 3, { x: sx, y: sy }));
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

drawGrid();
(function() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      calcMines({ x: i, y: j });
    }
  }
})();

canvas.onmousedown = function(evt) {
  const padding = 46;
  const cellSize = 40;
  const x = Math.floor((event.pageX - canvas.offsetLeft - padding) / cellSize);
  const y = Math.floor((event.pageY - canvas.offsetTop - padding) / cellSize);
  //get mouse button to determine left or right click
  const mouseClick = evt.button;
  const leftClick = 0;
  //   const rightClick = 2;
  if (mouseClick == leftClick) {
    cells[x][y].open();
    //Check if there are unopened cells
    //unopened + marked should be 1000
  } else {
    cells[x][y].markAsBomb();
  }
};

//Prevent context menu (right click)
document.addEventListener("contextmenu", event => event.preventDefault());
