const colors = [
    'red',
    'green',
    'purple',
    'grey',
    'yellow',
    'blue'
];
const currentTetrinomo = {
    parts: [],
    color: colors[Math.floor(Math.random() * colors.length)],
    type: null
};
const grid = 30;
const placedParts = [];

const canvas = document.getElementById('game-screen');
const ctx = canvas.getContext('2d');

function drawCanvasLines() {
    var totalWidthLines = (canvas.width / grid);
    var totalHeightLines = (canvas.height / grid);

    for (let i = 0; i < totalWidthLines; i++) {
        ctx.beginPath();
        ctx.moveTo((grid * i), 0);
        ctx.lineTo((grid * i), canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i < totalHeightLines; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (grid * i));
        ctx.lineTo(canvas.width, (grid * i));
        ctx.stroke();
    }
}

function drawCurrentTetrinomo() {
    for (let pieceIndex = 0; pieceIndex < currentTetrinomo.parts.length; pieceIndex++) {
        ctx.fillStyle = currentTetrinomo.color;
        ctx.fillRect(currentTetrinomo.parts[pieceIndex].x, currentTetrinomo.parts[pieceIndex].y, grid, grid);
    }
}

function clearCtx() {
    ctx.canvas.width = ctx.canvas.width;
}

function createNewTetrinomo() {
    currentTetrinomo.parts = [];
    currentTetrinomo.color = colors[Math.floor(Math.random() * colors.length)];
    indexType = Math.floor(Math.random() * allTypes.length);
    newType = allTypes[indexType][0];

    for (let row = 0; row < newType.length; row++) {
        for (let column = 0; column < newType[row].length; column++) {
            if (!!newType[row][column]) {
                currentTetrinomo.parts.push({ x: column * grid, y: (row * grid) - grid })
                currentTetrinomo.indexType = indexType;
                currentTetrinomo.type = 0;
                currentTetrinomo.types = allTypes[indexType].length;
            }
        }
    }
}

function nextCurrentTetrinomoPosition() {
    for (let i = 0; i < currentTetrinomo.parts.length; i++) {
        currentTetrinomo.parts[i].y += grid;
    }
}

function isTetrinomoTouching() {
    for (let i = 0; i < currentTetrinomo.parts.length; i++) {
        if ((currentTetrinomo.parts[i].y + grid) >= canvas.height) {
            return true;
        } 

        for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
            if ((currentTetrinomo.parts[i].y + grid) == placedParts[partIndex].y && currentTetrinomo.parts[i].x == placedParts[partIndex].x && placedParts[partIndex].draw) {
                return true;
            }
        }
    }

    return false;
}

/*
function updateTrinomoDirection() {
    let actualType = allTypes[currentTetrinomo.indexType][currentTetrinomo.type];
    let actualPointX = (currentTetrinomo.parts[0].x / grid);
    let actualPointY = (currentTetrinomo.parts[0].y / grid);
    
    currentTetrinomo.parts = [];
    for (let row = 0; row < actualType.length; row++) {
        for (let column = 0; column < actualType[row].length; column++) {
            if (!!actualType[row][column]) {
                currentTetrinomo.parts.push({ x: actualPointX * grid, y: actualPointY * grid });
                actualPointX += 1;
            }
        }
    }

}
*/

function removeAllFilledLines() {
    var totalHeightLines = (canvas.height / grid);
    var totalLineSize = 0;

    for (let pointY = 0; pointY < totalHeightLines; pointY++) {
        for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
            if (placedParts[partIndex].y == (pointY * grid) && placedParts[partIndex].draw) {
                totalLineSize += grid;
            }
        }

        if (totalLineSize == canvas.width) {
            for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
                if (placedParts[partIndex].y == (pointY * grid)) {
                    placedParts[partIndex].draw = false;
                }
            }

            for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
                if (placedParts[partIndex].y < (pointY * grid)) {
                    placedParts[partIndex].y += grid;
                }
            }
        }
    
        totalLineSize = 0;
    }
}

function isGameOver() {
    for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
        if (placedParts[partIndex].y < 0) {
            return true;
        }
    }

    return false;
}

function placeCurrentTetrinomo() {
    for (let i = 0; i < currentTetrinomo.parts.length; i++) {
        placedParts.push({ x: currentTetrinomo.parts[i].x, y: currentTetrinomo.parts[i].y, color: currentTetrinomo.color, draw: true });
    }
}

function renderPlacedParts() {
    for (let i = 0; i < placedParts.length; i++) {
        if (placedParts[i].draw) {
            ctx.fillStyle = placedParts[i].color;
            ctx.fillRect(placedParts[i].x, placedParts[i].y, grid, grid);
        }
    }
}

function onKeyPress(e) {
    if (e.key.toLowerCase() == 'd') {
        for (let i = 0; i < currentTetrinomo.parts.length; i++) {
            if ((currentTetrinomo.parts[i].x + grid) >= canvas.width) {
                return false;
            }

            for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
                if ((currentTetrinomo.parts[i].x + grid) == placedParts[partIndex].x && currentTetrinomo.parts[i].y == placedParts[partIndex].y) {
                    return false;
                }
            }
        }

        for (let i = 0; i < currentTetrinomo.parts.length; i++) {
            currentTetrinomo.parts[i].x += grid;
            clearCtx();
            drawCurrentTetrinomo();
            renderPlacedParts();
            drawCanvasLines();
        }
    }

    if (e.key.toLowerCase() == 'a') {
        for (let i = 0; i < currentTetrinomo.parts.length; i++) {
            if ((currentTetrinomo.parts[i].x - grid) < 0) {
                return false;
            }

            for (let partIndex = 0; partIndex < placedParts.length; partIndex++) {
                if ((currentTetrinomo.parts[i].x - grid) == placedParts[partIndex].x && currentTetrinomo.parts[i].y == placedParts[partIndex].y) {
                    return false;
                }
            }
        }

        for (let i = 0; i < currentTetrinomo.parts.length; i++) {
            currentTetrinomo.parts[i].x -= grid;
            clearCtx();
            drawCurrentTetrinomo();
            renderPlacedParts();
            drawCanvasLines();
        }
    }

    /*
    if (e.key.toLowerCase() == 'w') {
        if (currentTetrinomo.types > 1) {
            if ((currentTetrinomo.type + 1) > currentTetrinomo.types) {
                currentTetrinomo.type = 0;
            } else {
                currentTetrinomo.type += 1;
            }

            updateTrinomoDirection();
        }
    }
    */
}

window.addEventListener('keydown', onKeyPress);
createNewTetrinomo();

function stopGameLoop() {
    clearInterval(loop);
    window.removeEventListener('keydown', onKeyPress);
}

function eachFrame() {
    clearCtx();
    drawCurrentTetrinomo();
    renderPlacedParts();
    drawCanvasLines();

    if (!isTetrinomoTouching()) {
        nextCurrentTetrinomoPosition();
    } else {
        placeCurrentTetrinomo();
        createNewTetrinomo();
    }

    removeAllFilledLines();

    if (isGameOver()) {
        stopGameLoop();
    }
}

let loop = setInterval(eachFrame, 100);