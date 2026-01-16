//config
config = {
    CELL_SIZE: 5,
    phases: [30, 10],
    ROW: 256,
    COLUMN: 256,
    KEY_COOLDOWN: 250,
    FRAMERATE: 15,
    CELL_TYPE: {
        0: {
            name: "water",
            color: [66, 135, 245],
        },
        1: {
            name: "grass",
            color: [60, 176, 68],
        },
        2: {
            name: "sand",
            color: [214, 211, 124],
        },
    },
};

//phase
function buildPhases() {
    let t = 0;
    let arr = [];

    for (i = 0; i < config.phases.length; i++) {
        t += config.phases[i];
        arr.push(t);
    }

    return arr;
}

let phase = buildPhases();
//

let board = [];
let row = config.ROW;
let col = config.COLUMN;

let pauseBtn;
let paused = true;

let frame = 0;
let lastETime = 0;
let lastRTime = 0;

/////////////////////////////
//        CELLS
/////////////////////////////

//count neighbors of a cell
function countAround(snapshot, i, j, criteria) {
    let cnt = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue; // skip self
            const neighbor = snapshot[i + x]?.[j + y];
            if (neighbor !== undefined && criteria(neighbor)) {
                cnt++;
            }
        }
    }
    return cnt;
}

//smoothen out the island shapes
function islandSmoothingRule(snapshot, i, j, n) {
    if (snapshot[i][j] !== 0) {
        //wall survives if 4+ neighbors are walls
        return n >= 4 ? 1 : 0;
    } else {
        //empty becomes wall if 5+ neighbors are walls
        return n >= 5 ? 1 : 0;
    }
}

//color them accordingly
function islandColorationRule(snapshot, i, j) {}

/////////////////////////////
//        BOARD MANAGEMENT
/////////////////////////////

function getActivePhase(frame, phases) {
    for (let i = phases.length - 1; i >= 0; i--) {
        if (frame >= phases[i]) {
            return i; // return index of active phase
        }
    }
    return -1; // no phase yet
}

function updateBoard() {
    if (paused) return;

    const snapshot = board.map((r) => [...r]);

    const activePhase = getActivePhase(frame, phase);

    // determine the rule based on phase index
    let rule = null;
    if (activePhase === 0) rule = islandSmoothingRule;
    else if (activePhase === 1) rule = islandColorationRule;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const n = countAround(snapshot, i, j, (t) => t !== 0);
            if (rule) {
                board[i][j] = rule(snapshot, i, j, n);
            } else {
                board[i][j] = snapshot[i][j]; // fallback
            }
        }
    }

    frame++; // increment frame AFTER processing
}

//render board
function renderBoard() {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let cell = board[i][j];
            strokeWeight(0);
            fill(config.CELL_TYPE[cell].color);
            rect(
                j * config.CELL_SIZE,
                i * config.CELL_SIZE,
                config.CELL_SIZE,
                config.CELL_SIZE
            );
        }
    }
}

//function that init the matrix with 0
function fillBoard(scale = 0.15, threshold = 0.5) {
    board = [];

    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < col; j++) {
            //perlin noise value between 0 and 1
            let n = noise(i * scale, j * scale);
            //threshold determines if cell is wall (1) or empty (0)
            board[i][j] = n > threshold ? 1 : 0;
        }
    }

    frame = 0;
}

/////////////////////////////
//        UTILS
/////////////////////////////

function accumulatePhases(phases) {
    const accumulated = [];
    let sum = 0;

    for (let i = 0; i < phases.length; i++) {
        sum += phases[i];
        accumulated.push(sum);
    }

    return accumulated;
}

function handlePause() {
    if (!paused) {
        paused = true;
        pauseBtn.html("currently paused");
    } else {
        paused = false;
        pauseBtn.html("currently looping");
    }
}

/////////////////////////////
//        P5 FUNCTIONS
/////////////////////////////

//setup
function setup() {
    createCanvas(config.CELL_SIZE * row + 5, config.CELL_SIZE * height + 5);

    const container = createDiv();
    container.id("container");

    pauseBtn = createButton("currently paused");
    pauseBtn.mousePressed(handlePause);
    pauseBtn.parent(container);

    let resetBtn = createButton("reset board");
    resetBtn.mousePressed(function () {
        fillBoard();
    });
    resetBtn.parent(container);

    fillBoard();
    frameRate(config.FRAMERATE);
}

//update
function draw() {
    renderBoard();
    updateBoard();

    if (keyIsDown(69) && millis() - lastETime > config.KEY_COOLDOWN) {
        //e
        handlePause();
        lastETime = millis();
    }

    if (keyIsDown(82) && millis() - lastRTime > config.KEY_COOLDOWN) {
        //r
        fillBoard();
        lastRTime = millis();
    }

    if (mouseIsPressed) {
        let j = floor(mouseX / config.CELL_SIZE);
        let i = floor(mouseY / config.CELL_SIZE);

        //out of bounds check
        if (i >= 0 && i < row && j >= 0 && j < col) {
            board[i][j] = 1;
        }
    }
}
