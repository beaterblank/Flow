const noiseScale = 0.005; // a lower value will result in less convolutions
const highQuality = true; // true: render lines using an ellipse, false: render lines drawing indivudual pixels

const colorRanges = [
    [0, 45],
    [90, 225],
    [180, 360],
    [315, 45],
]
var d = new Date()
var h = d.getHours();
var m = d.getMinutes();
let flowField = [];
let angleMod = 0;
let fpsCounter;
let currentColorSet = [];

function setup() {
    colorMode(HSB);
    createCanvas(windowWidth, windowHeight);
    currentColorRange = random(colorRanges);
    const maxLines = highQuality ? 6000 : 10000; // rendering ellipses is using more ressources, so we lower the paricles
    for (let i = 0; i < maxLines; i++) {
        flowField.push(new FlowLine(random(0, width), random(0, height)));
    }
    textFont('Georgia');
    textSize(100)
}

function draw() {
    for (let i = 0; i < flowField.length; i++) {
        const line = flowField[i];
        if (line.isOutOfBounds()) {
            flowField.splice(i, 1);
            flowField.push(new FlowLine(random(0, width), random(0, height)));
            angleMod = map(noise(frameCount * 0.0001), 0, 1, -180, 180); // move the angle over time for a more "hairy" look
        } else {
            line.draw();
        }
    }

    push()
    text(h + " : " + m, width / 2, height / 2)
    pop()
}

function FlowLine(x, y) {
    this.alpha = 0.075;
    this.initialize = function() {
        this.point = createVector(x, y);
        this.updateNoise();
        this.updateDirection();
        this.setColor();
    }
    this.draw = function() {
        if (highQuality) {
            noStroke();
            fill(this.color);
            ellipse(this.point.x, this.point.y, 2);
        } else {
            stroke(this.color);
            point(this.point.x, this.point.y);
        }

        this.updateDirection();
        this.updateNoise();
    }
    this.setColor = function() {
        this.color = color(
            map(this.noise, 0, 1, currentColorRange[0], currentColorRange[1]),
            100,
            100,
            this.alpha
        );
    }
    this.updateDirection = function() {
        this.direction = p5.Vector.fromAngle(radians(map(this.noise, 0, 1, 0, 360) + angleMod));
        this.point.add(this.direction);
    }
    this.updateNoise = function() {
        this.noise = noise(this.point.x * noiseScale, this.point.y * noiseScale);
    }
    this.isOutOfBounds = function() {
        return this.point.x < 0 || this.point.y < 0 || this.point.x > width || this.point.y > height;
    }
    this.initialize();
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    currentColorRange = random(colorRanges);
    const maxLines = highQuality ? 6000 : 10000; // rendering ellipses is using more ressources, so we lower the paricles
    for (let i = 0; i < maxLines; i++) {
        flowField.push(new FlowLine(random(0, width), random(0, height)));
    }
}