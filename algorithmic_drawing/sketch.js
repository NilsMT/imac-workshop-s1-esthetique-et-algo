let width = 640;
let height = 400;

let mode = 0;
let btn;

function canvasResize(w, h) {
    width = w;
    height = h;
    resizeCanvas(width, height);

    btn.position(10, height + 10);
}

function setup() {
    createCanvas(width, height);

    btn = createButton("Switch sketch");

    btn.mousePressed(() => {
        mode = mode < 1 ? 1 : 0;

        strokeWeight(1);
        background(255);
    });
}

function draw() {
    if (mode == 0) {
        canvasResize(640, 400);
        colorMode(RGB, 255);
        stroke(0);

        let n = 0; //N=0
        let x = width; // X=Xrsl%
        let y = height; // Y=Yrsl%
        let d = 0;

        do {
            d += 1; // D=D+1
            strokeWeight(d); // Defline 1,D ? (jsp)
            n += d + 1; // N=N+D+1
            x -= d + 10; // X=X-D-10
            y -= d + 10; // Y=Y-D-10

            line(n, n, n, y); //To N,N To N,Y
            line(n, y, x, y); //To N,Y To X,Y
            line(x, y, x, n); //To X,Y To X,N
            line(x, n, n, n); //To X,N To N,N
        } while (n < y); // Until N>=Y
    } else if (mode == 1) {
        canvasResize(400, 400);
        colorMode(HSB, 360, 100, 100); // hue 0-360, saturation & brightness 0-100

        let a = width / 2;
        let b = height / 2;
        for (let i = 1; i <= 2; i++) {
            let r = height * 0.7;
            let rMax = r;
            for (let w = Math.PI / 4; w <= 3.6; w += 0.05) {
                let x = r * Math.cos(w);
                let y = r * Math.sin(w);
                line(a + x, b - y, a - y, b - x);
                line(a - y, b - x, a - x, b + x);
                line(a - x, b + y, a + x, b - y);
                line(a - x, b + y, a + y, b + x);
                line(a + y, b + x, a + x, b - y);
                r = r * 0.94;

                let hueValue = map(r, 0, rMax, 0, 360); //map r to hue rotation
                stroke(hueValue, 100, 100); //set color from hue
            }
        }
    }
}
