let config = {
    //UI Data
    CANVAS_HEIGHT: 800, //TODO: make it vary from text
    CANVAS_WIDTH: 800, //TODO: make it vary from text
    CELL_SIZE: 10,
    TEXT: "oui",
};

////////////////////////////////
//  JSON Dominos
////////////////////////////////

const DOMINOS = {
    y: {},
    x: {},
};

const SPE_DOMINOS = {
    y: {
        "?-?": "🁢",
    },
    x: {
        "?-?": "🀰",
    },
};

//random at start
let previousDomino = [-1, -1];

//return the list of char included in the range
function appendCharInRange(st, nd, json) {
    let sub_index = 0;
    for (let i = st; i <= nd; i++) {
        //UNICODE dominos order goes 0-0, 0-1, ... 6-6
        const row = Math.floor(sub_index / 7);
        const col = sub_index % 7;

        //name objet accordingly "X-Y"
        json[`${row}-${col}`] = String.fromCodePoint(i);
        sub_index++;
    }
}

//turn X-Y into XY
function getDominoValue(k) {
    return Number(k.replace("-", ""));
}

//turn X-Y into [X,Y]
function splitDominoValue(k) {
    return k.split("-").map((m) => Number(m));
}

//fill the json
function initJson() {
    //add dominoes
    appendCharInRange(0x1f031, 0x1f061, DOMINOS.x); //127025–127073 UNICODE range
    appendCharInRange(0x1f063, 0x1f093, DOMINOS.y); //127075–127123 UNICODE range

    console.log(DOMINOS);
    console.log(SPE_DOMINOS);
}

//orientation is "x" or "y"
function giveAdequateDominos(code, json) {
    let result = "";
    let ori = json["0-0"] === DOMINOS["x"]["0-0"] ? "x" : "y";
    let keys = Object.keys(json);
    let sum = 0;

    console.warn("what should fit: " + code);

    //loop until no more to give
    while (code > 0) {
        // stop if previous domino is [0,0]
        if (previousDomino[0] === 0 && previousDomino[1] === 0) {
            break;
        }

        // initialize previousDomino if it's the joker state
        if (previousDomino[0] === -1 && previousDomino[1] === -1) {
            previousDomino = [0, code % 7];
        }

        // select subtraction candidates
        let candidates = keys.filter((k) => {
            let sp = splitDominoValue(k); // [start, end]
            let val = getDominoValue(k); // X*10 + Y

            let fit = val <= code; // can this domino fit numerically?
            let canBePlayed = sp[0] === previousDomino[1]; // must match previous domino's end

            return fit && canBePlayed;
        });

        if (candidates.length > 0) {
            // choose one of them at random
            let choice = Math.floor(Math.random() * candidates.length);
            let chosenKey = candidates[choice];

            let choseVal = getDominoValue(chosenKey);
            let choseSp = splitDominoValue(chosenKey);

            // add to result
            result += json[chosenKey];
            previousDomino = choseSp;

            // subtract choice, then reiterate
            code -= choseVal;
            sum += choseVal;
        } else {
            // no candidate found → break loop
            break;
        }
    }

    console.warn("what fit: " + sum);

    //add end character (so everything can be played after)
    result += SPE_DOMINOS[ori]["?-?"];
    previousDomino = [-1, -1];
    return result;
}

////////////////////////////////
//  Table
////////////////////////////////

function initTab() {
    for (let i = 0; i < row; i++) {
        table[i] = [];
        for (let j = 0; j < col; j++) {
            table[i][j] == 0;
        }
    }
}

////////////////////////////////
//  Base functions
////////////////////////////////

let table = [];
let row = Math.floor(config.CANVAS_HEIGHT / config.CELL_SIZE);
let col = Math.floor(config.CANVAS_WIDTH / config.CELL_SIZE);
let currentRow = 0;
let currentCol = 0;

function setup() {
    createCanvas(config.CANVAS_HEIGHT, config.CANVAS_WIDTH);
    frameRate(60);
    background(0);

    initTab();
    initJson();

    let lst = config.TEXT.split(" ");
    let result = "";
    let ori = "x";

    lst.forEach((word) => {
        //switch direction
        ori = ori === "x" ? "y" : "x";

        let adequateWord = word
            .split("")
            .map((char) => {
                let code = char.charCodeAt(0);
                let adequateDominos = giveAdequateDominos(code, DOMINOS[ori]);
                return adequateDominos;
            })
            .join("");

        result += adequateWord;

        console.warn(word);
        console.log("%c" + adequateWord, "font-size: 24px");
    });
}

function draw() {}
