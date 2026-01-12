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
        colorMode(HSB, 360, 100, 100); //HSB https://fr.wikipedia.org/wiki/Teinte_Saturation_Valeur

        let a = width / 2; //A=Xrsl%/2
        let b = height / 2; //B=Yrsl%/2
        for (let i = 1; i <= 2; i++) {
            //For I=1 To 11
            let r = height * 0.7; //R=Yrsl%*0.7
            let rMax = r;
            for (let w = Math.PI / 4; w <= 3.6; w += 0.05) {
                //For W=Pi/4 To 3.6 Step 0.05

                //Color
                let hueValue = map(r, 0, rMax, 0, 360); //map r to hue rotation
                stroke(hueValue, 100, 100); //set color from hue
                //

                let x = r * Math.cos(w); //X=R*Cos(W)
                let y = r * Math.sin(w); //Y=R*Sin(W)
                line(a + x, b - y, a - y, b - x); //Line A+X,B-Y,A-Y,B-X
                line(a - y, b - x, a - x, b + x); //Line A-Y,B-X,A-X,B+X
                line(a - x, b + y, a + x, b - y); //Line A-X,B+Y,A+X,B-Y
                line(a - x, b + y, a + y, b + x); //Line A-X,B+Y,A+Y,B+X
                line(a + y, b + x, a + x, b - y); //Line A+X,B+X,A+X,B-Y
                r = r * 0.94; //R=R*0.94
            }
        }
    }
}
