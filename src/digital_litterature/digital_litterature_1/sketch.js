let config = {
    //UI Data
    CANVAS_HEIGHT: 800,
    CANVAS_WIDTH: 800,
    SPACE_CODE: 32,
    DOMINOS: [
        //X dominos (0-12)
        "🁣",
        "🁤",
        "🁥",
        "🁦",
        "🁧",
        "🁨",
        "🁩",
        "🁰",
        "🁷",
        "🁾",
        "🂅",
        "🂌",
        "🂓",
        //X+12 dominos (12-24)
        "🀲",
        "🀳",
        "🀴",
        "🀵",
        "🀶",
        "🀷",
        "🀾",
        "🁅",
        "🁌",
        "🁓",
        "🁚",
        "🁡",
    ],
};

let input = "";

///////////////////////////////////

function generateText(txt) {
    let dominoEquiv = "";

    //loop each char of input
    for (let i = 0; i < txt.length; i++) {
        let char = txt[i];

        let code = char.charCodeAt(0);
        dominoEquiv += getDominoesChar(code) + "🁢"; //get equivalent in dominos + separator char
    }

    return dominoEquiv;
}

function getDominoesChar(code) {
    const dominoCount = config.DOMINOS.length;
    let str = "";

    if (code == config.SPACE_CODE) {
        return config.DOMINOS[0];
    }

    while (code > 0) {
        //pick the largest domino whose index <= code
        for (let i = dominoCount - 1; i >= 0; i--) {
            if (i <= code) {
                str += config.DOMINOS[i];
                code -= i;
                break;
            }
        }
    }

    return str;
}

///////////////////////////////////

function translateRandomQuote() {
    const inputElement = document.getElementById("input");
    const outputElement = document.getElementById("output");

    //fetch random kanye quote to translate (pre-filling the input)
    fetch("https://api.kanye.rest/")
        .then((response) => response.json())
        .then((data) => {
            inputElement.textContent = data.quote;
            //translation
            outputElement.textContent = generateText(data.quote);
        })
        .catch((error) => console.error("Error fetching quote:", error));
}

//event listener to redo
const btn = document.getElementById("regen").addEventListener("click", (ev) => {
    translateRandomQuote();
});

translateRandomQuote(); //RUN ONCE
