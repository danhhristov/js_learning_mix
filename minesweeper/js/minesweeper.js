var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var debug_enabled = false;

function drawGrid() {
    if (debug_enabled) console.log("Drawing grid...");
    let strokeSize = canvas
        .getAttribute("height")
        .substring(0, canvas.getAttribute("height").indexOf("px"));
    for (let i = 1; i < 10; i++) {
        let startPos = i * 40;
        ctx.moveTo(startPos, 0);
        ctx.lineTo(startPos, strokeSize);
        ctx.stroke();
        ctx.moveTo(0, startPos);
        ctx.lineTo(strokeSize, startPos);
        ctx.stroke();
    }
    if (debug_enabled) console.log("Grid completed");
}

function debug_toggle() {
    debug_enabled = !debug_enabled;
    console.log(`Debug ${debug_enabled ? "enabled" : "disabled"}`);
}

drawGrid();
