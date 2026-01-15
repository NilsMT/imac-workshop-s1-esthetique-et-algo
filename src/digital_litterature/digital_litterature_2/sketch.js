let config = {
    TEXT: "",
    //UI Data
    CELL_SIZE: 10,
    START_ORI: "x",
};

const outputElement = document.getElementById("output");
const inputElement = document.getElementById("input");

////////////////////////////////
//  ADDITIONAL STUFF
////////////////////////////////
function mulberry32(seed) {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

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

//turn char to html entity so it display
function charToHtmlEntity(char) {
    const code = char.codePointAt(0);
    return `&#${code};`; // decimal
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

//code=  UNICODE, json is the selected set of dominos, pos is the position of the char in the word
function giveDominos(code, json, pos) {
    let result = "";
    let ori = json["0-0"] === DOMINOS["x"]["0-0"] ? "x" : "y";
    let originalCode = code;
    let keys = Object.keys(json);

    //loop until no more to give
    while (code > 0) {
        //stop if previous domino is [0,0]
        if (previousDomino[0] === 0 && previousDomino[1] === 0) {
            break;
        }

        //initialize previousDomino if it's the joker state
        if (previousDomino[0] === -1 && previousDomino[1] === -1) {
            previousDomino = [0, code % 7];
        }

        // select subtraction candidates
        let candidates = keys.filter((k) => {
            let sp = splitDominoValue(k); //[start, end]
            let val = getDominoValue(k); //X*10 + Y

            let fit = val <= code; //can this domino fit numerically?
            let canBePlayed = sp[0] === previousDomino[1]; //must match previous domino's end

            return fit && canBePlayed;
        });

        if (candidates.length > 0) {
            //choose one of them at random (deterministic) https://github.com/cprosche/mulberry32
            let choice = Math.floor(
                mulberry32(originalCode + pos) * candidates.length
            );
            let chosenKey = candidates[choice];

            let choseVal = getDominoValue(chosenKey);
            let choseSp = splitDominoValue(chosenKey);

            //add to result
            result += (ori === "x" ? "" : "<br>") + json[chosenKey];
            previousDomino = choseSp;

            //subtract choice, then reiterate
            code -= choseVal;
        } else {
            //no candidate found, end of chain
            break;
        }
    }

    //add end character (so everything can be played after)
    result += (ori === "x" ? "" : "<br>") + SPE_DOMINOS[ori]["?-?"];
    previousDomino = [-1, -1];
    return result;
}

////////////////////////////////
//  Base functions
////////////////////////////////

function translate() {
    //split the text to get each word
    let lst = config.TEXT.split(new RegExp("\\s+"));
    let ori = config.START_ORI;

    //loop over each word
    lst.forEach((word) => {
        //translate the word into dominoes
        let dominosWord = word
            .split("")
            .map((char, i) => {
                //translate each char of word
                let code = char.charCodeAt(0);
                return giveDominos(code, DOMINOS[ori], i);
            })
            .join("");

        console.warn(word);
        //clean output for dominos
        let cleanDominos = dominosWord.replace(/<br\s*\/?>/gi, "");
        console.log("%c" + cleanDominos, "font-size: 24px");

        outputElement.innerHTML += dominosWord;

        //switch direction
        ori = ori === "x" ? "y" : "x";
    });
}

////////////////////////////////
//  Main functions
////////////////////////////////

function main() {
    initJson();

    inputElement.addEventListener("input", (ev) => {
        config.TEXT = ev.target.value;
        outputElement.innerHTML = "";
        translate();
    });
}

main();
