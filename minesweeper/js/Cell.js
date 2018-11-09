"use strict";
const ctx = document.getElementById("canvas").getContext("2d");
const icons = {
  back: "/minesweeper/icons/back.png",
  flag: "/minesweeper/icons/flag.png",
  mine: "/minesweeper/icons/mine.png",
  0: "/minesweeper/icons/0.png",
  1: "/minesweeper/icons/1.png",
  2: "/minesweeper/icons/2.png",
  3: "/minesweeper/icons/3.png",
  4: "/minesweeper/icons/4.png",
  5: "/minesweeper/icons/5.png",
  6: "/minesweeper/icons/6.png",
  7: "/minesweeper/icons/7.png",
  8: "/minesweeper/icons/8.png"
};

/**
 *
 * @param { point, bomb, w, h} state object contains the initial values
 * needed for a cell to be initialised:
 * point - {x, y} coordinates relative to the canvas,
 * bomb - a flag to determine if the cell contains a bomb,
 * w[idth] and h[eight] - dimensions of the cell
 */
const CellFactory = state => {
  let x = state.point.x;
  let y = state.point.y;
  let point = state.point;
  let bomb = state.bomb;
  let bombCount = 0;
  let isOpen = false;
  let w = state.w;
  let h = state.h;
  let drawImage = img => {
    ctx.drawImage(img, x, y);
  };
  let fImage = new Image(w, h);
  fImage.onload = function() {
    drawImage(this);
  };
  fImage.src = icons.back;
  let bImage = new Image(w, h);
  bImage.onload = function() {
    drawImage(this);
  };
  let markedBomb = false;

  return {
    //public functions here
    increaseBombCount() {
      bombCount++;
    },

    markAsBomb() {
      if (!isOpen) {
        markedBombs = markedBombs + (markedBomb ? -1 : 1);
        markedBomb = !markedBomb;
        bImage.src = markedBomb ? icons.flag : icons.back;
        setBombCount();
      }
    },

    getBombCount() {
      return bombCount;
    },

    getPoint() {
      return point;
    },

    isBomb() {
      return bomb;
    },

    isOpen() {
      return isOpen;
    },

    isMarked() {
      return markedBomb;
    },

    showIcon() {
      bImage.src = bomb ? icons.mine : icons[bombCount];
    },

    open() {
      if (!isOpen) {
        isOpen = true;
        openedCells++;
        this.showIcon();
        if (bomb) {
          //game over :(
          stopTimer();
          showAllBombs();
          gameOver();
        } else if (bombCount == 0) {
          //open all neighbours which are not bombs
          openEmptyNeighbours(point);
        }
      }
    }
  };
};
