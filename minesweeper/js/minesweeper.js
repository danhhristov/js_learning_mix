"use strict";
//Refactoring in progress things might break at times :) :/
const cell_width = 40;
const cell_height = 40;
const difficulties = {
  easy: 2.5,
  medium: 4,
  hard: 5.5
};
const leftClick = 0;
const rightClick = 2;
//maybe add jquery to simplify some stuff ?
const timer = document.getElementById("timer");
const bombCount = document.getElementById("bombs");
const canvas = document.getElementById("canvas");
const mouse = {
  left: false,
  right: false
};

//Could make this an arrow function
//and use it as a class and avoid resetting everything manually
//by just creating a new object every time ...
//This will also allow for the creation of private variables instead
//of the current public ones (even if they are within the game const).
//This will be next step of refactoring...
const game = {
  difficulty: "easy",
  timerInterval: null,
  startDate: null,
  cells: null,
  openedCells: null,
  bombs: 0,
  markedBombs: 0,

  getDifficulty: () => {
    return this.difficulty;
  },

  setDifficulty: difficulty => {
    this.difficulty = difficulty;
  },

  getTimerInterval: () => {
    return this.timerInterval;
  },

  setTimerInterval: timerInterval => {
    this.timerInterval = timerInterval;
  },

  getStartDate: () => {
    return this.startDate;
  },

  setStartDate: date => {
    this.startDate = date;
  },

  getCells: () => {
    return this.cells;
  },

  setCells: cells => {
    this.cells = cells;
  },

  getOpenedCells: () => {
    return this.openedCells;
  },

  setOpenedCells: openedCells => {
    this.openedCells = openedCells;
  },

  getBombs: () => {
    return this.bombs;
  },

  setBombs: bombs => {
    this.bombs = bombs;
  },

  getMarkedBombs: () => {
    return this.markedBombs;
  },

  setMarkedBombs: markedBombs => {
    this.markedBombs = markedBombs;
  }
};

/**
 *
 * @param {point, bomb, notBomb, notMarked, open} arg object contains
 * the point of the cell and flags to determine which conditions to check
 * for the given cell's neighbours
 * and the action to take upon meeting that condition:
 * bomb - check if bombs, notBomb - check if not bombs,
 * notMarked - check if not marked,
 * open - open the cell or if false or non existent, add 1 to mines count for that cell
 */
const iterateCellNeighbours = (arg = {}) => {
  if (!arg) return;
  const x = arg.point.x / cell_width;
  const y = arg.point.y / cell_height;
  const cells = game.getCells();

  if (cells[x - 1]) {
    if (
      cells[x - 1][y - 1] &&
      ((arg.notBomb && !cells[x - 1][y - 1].isBomb()) ||
        (arg.notMarked && !cells[x - 1][y - 1].isMarked()) ||
        (arg.bomb && cells[x - 1][y - 1].isBomb()))
    )
      arg.open ? cells[x - 1][y - 1].open() : cells[x][y].increaseBombCount();
    if (
      cells[x - 1][y] &&
      ((arg.notBomb && !cells[x - 1][y].isBomb()) ||
        (arg.notMarked && !cells[x - 1][y].isMarked()) ||
        (arg.bomb && cells[x - 1][y].isBomb()))
    )
      arg.open ? cells[x - 1][y].open() : cells[x][y].increaseBombCount();
    if (
      cells[x - 1][y + 1] &&
      ((arg.notBomb && !cells[x - 1][y + 1].isBomb()) ||
        (arg.notMarked && !cells[x - 1][y + 1].isMarked()) ||
        (arg.bomb && cells[x - 1][y + 1].isBomb()))
    )
      arg.open ? cells[x - 1][y + 1].open() : cells[x][y].increaseBombCount();
  }
  if (
    cells[x][y - 1] &&
    ((arg.notBomb && !cells[x][y - 1].isBomb()) ||
      (arg.notMarked && !cells[x][y - 1].isMarked()) ||
      (arg.bomb && cells[x][y - 1].isBomb()))
  )
    arg.open ? cells[x][y - 1].open() : cells[x][y].increaseBombCount();
  if (
    cells[x][y + 1] &&
    ((arg.notBomb && !cells[x][y + 1].isBomb()) ||
      (arg.notMarked && !cells[x][y + 1].isMarked()) ||
      (arg.bomb && cells[x][y + 1].isBomb()))
  )
    arg.open ? cells[x][y + 1].open() : cells[x][y].increaseBombCount();

  if (cells[x + 1]) {
    if (
      cells[x + 1][y - 1] &&
      ((arg.notBomb && !cells[x + 1][y - 1].isBomb()) ||
        (arg.notMarked && !cells[x + 1][y - 1].isMarked()) ||
        (arg.bomb && cells[x + 1][y - 1].isBomb()))
    )
      arg.open ? cells[x + 1][y - 1].open() : cells[x][y].increaseBombCount();
    if (
      cells[x + 1][y] &&
      ((arg.notBomb && !cells[x + 1][y].isBomb()) ||
        (arg.notMarked && !cells[x + 1][y].isMarked()) ||
        (arg.bomb && cells[x + 1][y].isBomb()))
    )
      arg.open ? cells[x + 1][y].open() : cells[x][y].increaseBombCount();
    if (
      cells[x + 1][y + 1] &&
      ((arg.notBomb && !cells[x + 1][y + 1].isBomb()) ||
        (arg.notMarked && !cells[x + 1][y + 1].isMarked()) ||
        (arg.bomb && cells[x + 1][y + 1].isBomb()))
    )
      arg.open ? cells[x + 1][y + 1].open() : cells[x][y].increaseBombCount();
  }
};

const openEmptyNeighbours = point => {
  iterateCellNeighbours({
    point: point,
    notBomb: true,
    open: true
  });
};

const openNeighbours = point => {
  iterateCellNeighbours({
    point: point,
    notMarked: true,
    open: true
  });
};

const calcMines = point => {
  iterateCellNeighbours({
    point: point,
    bomb: true
  });
};

const gameOver = () => {
  clearBoundEvents();
  alert("You lose :(");
};

const gameWon = () => {
  clearBoundEvents();
  alert("You win :)");
};

const clearBoundEvents = () => {
  canvas.onmousedown = null;
  canvas.onmouseup = null;
};

const setBombCount = () => {
  bombCount.innerHTML = game.getMarkedBombs();
};

const showAllBombs = () => {
  const cells = game.getCells();
  for (let i = 0; i < cells.length; i++) {
    for (let cell of cells[i]) {
      if (cell.isBomb() && !cell.isMarked()) cell.showIcon();
    }
  }
};

const drawGrid = () => {
  let cells = game.getCells();
  let bombs = game.getBombs();
  for (let i = 0; i <= 9; i++) {
    let sx = i * cell_width;
    for (let j = 0; j <= 9; j++) {
      let sy = j * cell_height;
      let rnd = Math.random() * 10 + 1;
      let bomb = rnd < difficulties[game.getDifficulty()];
      cells[i].push(
        CellFactory({
          point: { x: sx, y: sy },
          bomb: bomb,
          w: cell_width,
          h: cell_height
        })
      );
      if (bomb) bombs++;
    }
  }
  game.setCells(cells);
  game.setBombs(bombs);
};

const initGame = () => {
  game.setCells([[], [], [], [], [], [], [], [], [], []]);
  game.setStartDate(new Date());
  game.setBombs(0);
  game.setMarkedBombs(0);
  game.setOpenedCells(0);
  mouse.left = false;
  mouse.right = false;
  setBombCount();
  drawGrid();
  const cells = game.getCells();
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      const point = { x: i * cell_width, y: j * cell_height };
      calcMines(point);
    }
  }
  initCanvasEvents();
  startTimer();
};

const startTimer = () => {
  game.setTimerInterval(
    setInterval(() => {
      const elapsedTime = (new Date() - game.getStartDate()) / 1000;
      let secs =
        "" + (elapsedTime % 60 < 10 ? "0" : "") + Math.floor(elapsedTime % 60);
      let minutes = elapsedTime / 60;
      let mins = "" + (minutes % 60 < 10 ? "0" : "") + Math.floor(minutes);
      let hours = minutes / 60;
      let hs = "" + (hours % 60 < 10 ? "0" : "") + Math.floor(hours);
      timer.innerHTML = hs + ":" + mins + ":" + secs;
    }, 999)
  );
};

const stopTimer = () => {
  clearInterval(game.getTimerInterval());
};

const initCanvasEvents = () => {
  canvas.onmouseup = function(evt) {
    const cells = game.getCells();
    const padding = 46;
    const x = Math.floor(
      (event.pageX - canvas.offsetLeft - padding) / cell_width
    );
    const y = Math.floor(
      (event.pageY - canvas.offsetTop - padding) / cell_height
    );
    if (x < 0 || x > cells.length - 1 || y < 0 || y > cells.length - 1)
      return false;

    const mouseClick = evt.button;
    if (mouseClick == leftClick || (mouseClick == rightClick && mouse.left)) {
      if (mouse.right) {
        openNeighbours(cells[x][y].getPoint());
      }
      cells[x][y].open();
      //Check if there are unopened cells
      const openedCells = game.getOpenedCells();
      if (
        openedCells + game.getMarkedBombs() >= 100 ||
        openedCells + game.getBombs() >= 100
      ) {
        stopTimer();
        gameWon();
      }
    } else if (mouseClick == rightClick) {
      cells[x][y].markAsBomb();
    }
    resetClicks();
  };
  canvas.onmousedown = function(evt) {
    if (evt.button == leftClick) mouse.left = true;
    else if (evt.button == rightClick) mouse.right = true;
  };
};

const resetClicks = () => {
  mouse.left = false;
  mouse.right = false;
};

const changeDifficulty = button => {
  game.setDifficulty(button.innerHTML.toLocaleLowerCase());
  initGame();
};
//Prevent context menu (right click)
document.addEventListener("contextmenu", event => event.preventDefault());
