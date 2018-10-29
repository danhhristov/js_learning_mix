var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const cell_width = (cell_height = 40);

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
    }

    increaseBombCount() {
        this.bombCount++;
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

    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.bImage.src = this.bomb
                ? "/minesweeper/icons/mine.png"
                : "/minesweeper/icons/" + this.bombCount + ".png";
            if (this.bomb) {
                //game over :(
                alert("Game over");
            }
        }
    }

    // click(point) {
    //     if(point.x > this.point.x && point.x < this.point.x + cell_width && point.y > this.point.y && point.y < this.point.y + cell_height){
    //         this.open();
    //     }
    // };
}

var cells = [[], [], [], [], [], [], [], [], [], []];

function drawGrid() {
    for (let i = 0; i <= 9; i++) {
        let sx = i * cell_width;
        for (let j = 0; j <= 9; j++) {
            let sy = j * cell_height;
            cells[i].push(new Cell(false, { x: sx, y: sy }));
        }
    }
}

drawGrid();

canvas.onclick = function() {
    const x = event.pageX - canvas.offsetLeft - 46 /* padding */;
    const y = event.pageY - canvas.offsetTop - 46 /* padding */;
    console.log(x);
    console.log(y);
    //use % 40 to find which row & column to click
};
