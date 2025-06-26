import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = (sketch) => {
    let WIDTH = sketch.windowWidth;
    let HEIGHT = sketch.windowHeight;
    const MARGIN = 10;

    const MAX_PARTICLE_COUNT = 500;
    const INIT_PARTICLE_COUNT = 40;
    const SPLITTING_FACTOR = 5;
    const SPEED = 7;

    const PARTICLES = [];
    const TREE = new QuadTree(SPLITTING_FACTOR, new Bound(0 - MARGIN, WIDTH + MARGIN, 0 - MARGIN, HEIGHT + MARGIN));

    const SIZE = 20;

    let debugOn = false;
    let avoidMouse = true;

    // initialize boids at random positions
    for (let i = 0; i < INIT_PARTICLE_COUNT; i++) {
        const boid = new Boid(Math.random() * WIDTH, Math.random() * HEIGHT, SPEED, sketch, SIZE * SIZE);
        TREE.add(boid);
        PARTICLES.push(boid);
    };

    const test = new Boid(Math.random() * 400 + 200, Math.random() * 400 + 200, SPEED, sketch, SIZE * SIZE);
    TREE.add(test);

    sketch.setup = () => {
        sketch.createCanvas(WIDTH, HEIGHT);
        sketch.background(0);
        sketch.angleMode(sketch.DEGREES);
    };

    sketch.draw = () => {
        sketch.background(136, 198, 219);

        if(debugOn) {
            TREE.debugNeighbors(sketch, test);
            TREE.debug(sketch);

            test.update(TREE.getNeighbors(test));

            wrapBoid(test);

            if (!test.parentNode.bound.contains(test.position)) {
                TREE.update(test);
            }
            sketch.fill(0);

            drawBoid(test);
        }
        

        sketch.fill(255);
        sketch.noStroke();

        // updates boid positions and renders
        for (const boid of PARTICLES) {
            if(avoidMouse) {
                boid.update(TREE.getNeighbors(boid), {x: sketch.mouseX, y: sketch.mouseY});
            } else {
                boid.update(TREE.getNeighbors(boid), undefined);
            }

            wrapBoid(boid);

            if (!boid.parentNode.bound.contains(boid.position)) {
                TREE.update(boid);
            }

            drawBoid(boid);
        }
    
        // spawns boids at mouse position
        if(sketch.mouseIsPressed && PARTICLES.length < MAX_PARTICLE_COUNT) {
            const boid = new Boid(sketch.mouseX, sketch.mouseY, SPEED, sketch, SIZE * SIZE);
            TREE.add(boid);
            PARTICLES.push(boid);
        }

        const counter = document.getElementById("counter")
        counter.textContent = "Boid Count: " + PARTICLES.length;
        if(PARTICLES.length == MAX_PARTICLE_COUNT) {
            counter.textContent += " (MAX)";
        }
    };

    sketch.keyPressed = () => {
        if(sketch.key === 's') {
            avoidMouse = !avoidMouse;
        }

        if(sketch.key === 'd') {
            debugOn = !debugOn;
        }
    }

    // renders given boid
    function drawBoid(boid) {
        //sketch.circle(boid.position.x, boid.position.y, SIZE - 2);

        const dirVector = boid.velocity.copy();
        dirVector.setMag(SIZE);
        let angle = dirVector.heading();

        if (angle > 180) {
            angle -= 180;
        }

        angle = 180 - (angle + 90);

        const xOffset = SIZE / 2 * sketch.cos(angle);
        const yOffset = SIZE / 2 * sketch.sin(angle);

        sketch.triangle(boid.position.x + dirVector.x * 1.5, boid.position.y + dirVector.y * 1.5,
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