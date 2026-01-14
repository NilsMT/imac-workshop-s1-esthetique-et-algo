const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 400;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
    colorMode(HSB, 360, 100, 100);
    stroke(0);

    let n = 0;
    let x = width;
    let y = height;
    let d = 0;

    do {
        d++;
        strokeWeight(d);
        n += d + 1;
        x -= d + 10;
        y -= d + 10;

        let hueValue = map(n, 0, height, 0, 360);
        stroke(hueValue, 100, 100);

        line(n, n, n, y);
        line(n, y, x, y);
        line(x, y, x, n);
        line(x, n, n, n);
    } while (n < y);
}
