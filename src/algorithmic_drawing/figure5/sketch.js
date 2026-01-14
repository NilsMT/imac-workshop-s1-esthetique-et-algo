const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
    colorMode(HSB, 360, 100, 100);

    let a = width / 2;
    let b = height / 2;

    for (let i = 0; i < 2; i++) {
        let r = height * 0.7;
        let rMax = r;

        for (let w = Math.PI / 4; w <= 3.6; w += 0.05) {
            let hueValue = map(r, 0, rMax, 0, 360);
            stroke(hueValue, 100, 100);

            let x = r * Math.cos(w);
            let y = r * Math.sin(w);

            line(a + x, b - y, a - y, b - x);
            line(a - y, b - x, a - x, b + x);
            line(a - x, b + y, a + x, b - y);
            line(a - x, b + y, a + y, b + x);
            line(a + y, b + x, a + x, b - y);

            r *= 0.94;
        }

        r /= 0.94;

        for (let w = 3.6; w >= Math.PI / 4; w -= 0.05) {
            let hueValue = map(r, 0, rMax, 0, 360);
            stroke(hueValue, 100, 100);

            let x = r * Math.cos(w);
            let y = r * Math.sin(w);

            line(a + x, b - y, a - y, b - x);
            line(a - y, b - x, a - x, b + x);
            line(a - x, b + y, a + x, b - y);
            line(a - x, b + y, a + y, b + x);
            line(a + y, b + x, a + x, b - y);

            r /= 0.94;
        }
    }
}
