import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = (sketch) => {
    const WIDTH = sketch.windowWidth;
    const HEIGHT = sketch.windowHeight;
    const MARGIN = 10;

    const PARTICLE_COUNT = 50;
    const SPLITTING_FACTOR = 5;
    const SPEED = 3;

    const PARTICLES = [];
    const TREE = new QuadTree(SPLITTING_FACTOR, new Bound(0 - MARGIN, WIDTH + MARGIN, 0 - MARGIN, HEIGHT + MARGIN));

    const SIZE = 30;

    // initialize boids at random positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const boid = new Boid(Math.random() * 400 + 200, Math.random() * 400 + 200, SPEED, sketch, SIZE * 2);
        TREE.add(boid);
        PARTICLES.push(boid);
    };

    sketch.setup = () => {
        sketch.createCanvas(WIDTH, HEIGHT);
        sketch.background(0);
        sketch.angleMode(sketch.DEGREES);
    };

    sketch.draw = () => {
        sketch.background(136, 198, 219);
        sketch.fill(255);
        sketch.noStroke();

        // updates boid positions and renders
        for (const boid of PARTICLES) {
            boid.update(TREE.getNeighbors(boid));

            wrapBoid(boid);

            if (!boid.parentNode.bound.contains(boid.position)) {
                TREE.update(boid);
            }

            drawBoid(boid);
        }

    };

    function drawBoid(boid) {
        sketch.circle(boid.position.x, boid.position.y, SIZE - 2);

        const dirVector = boid.velocity.copy();
        dirVector.setMag(SIZE);
        let angle = dirVector.heading();

        if (angle > 180) {
            angle -= 180;
        }

        angle = 180 - (angle + 90);

        const xOffset = SIZE / 2 * sketch.cos(angle);
        const yOffset = SIZE / 2 * sketch.sin(angle);

        sketch.triangle(boid.position.x + dirVector.x, boid.position.y + dirVector.y,
            boid.position.x - xOffset, boid.position.y + yOffset,
            boid.position.x + xOffset, boid.position.y - yOffset);
    }

    // wraps boid to other side of window once at the edge
    function wrapBoid(boid) {
        if (boid.position.x > WIDTH) {
            boid.x = 0;
        }

        if (boid.position.y > HEIGHT) {
            boid.y = 0;
        }

        if (boid.position.x < 0) {
            boid.x = WIDTH;
        }

        if (boid.position.y < 0) {
            boid.y = HEIGHT;
        }
    }

};

let myp5 = new p5(s);