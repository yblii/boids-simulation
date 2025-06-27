import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = (sketch) => {
    let width = sketch.windowWidth;
    let height = sketch.windowHeight;
    const MARGIN = 10;

    const MAX_BOID_COUNT = 500;
    const INIT_BOID_COUNT = 40;
    const SPLITTING_FACTOR = 5;
    const SPEED = 7;
    const BOID_SIZE = 20;

    const boids = [];
    const tree = new QuadTree(SPLITTING_FACTOR, new Bound(0 - MARGIN, width + MARGIN, 0 - MARGIN, height + MARGIN));
    const testBoid = new Boid(Math.random() * width, Math.random() * height, SPEED, sketch, BOID_SIZE * BOID_SIZE);

    let debugOn = false;
    let avoidMouse = true;

    sketch.setup = () => {
        sketch.createCanvas(width, height);
        sketch.background(136, 198, 219);
        sketch.angleMode(sketch.DEGREES);
        newSimulation();
    };

    sketch.draw = () => {
        sketch.background(136, 198, 219);

        if(debugOn) {
            tree.debugNeighbors(sketch, testBoid);
            tree.debug(sketch);

            testBoid.update(tree.getNeighbors(testBoid));

            wrapBoid(testBoid);

            if (!testBoid.parentNode.bound.contains(testBoid.position)) {
                tree.update(testBoid);
            }
            sketch.fill(0);

            drawBoid(testBoid);
        }
        

        sketch.fill(255);
        sketch.noStroke();

        // updates boid positions and renders
        for (const boid of boids) {
            if(avoidMouse) {
                boid.update(tree.getNeighbors(boid), {x: sketch.mouseX, y: sketch.mouseY});
            } else {
                boid.update(tree.getNeighbors(boid), undefined);
            }

            wrapBoid(boid);

            if (!boid.parentNode.bound.contains(boid.position)) {
                tree.update(boid);
            }

            drawBoid(boid);
        }
    
        // spawns boids at mouse position
        if(sketch.mouseIsPressed && boids.length < MAX_BOID_COUNT) {
            const boid = new Boid(sketch.mouseX, sketch.mouseY, SPEED, sketch, BOID_SIZE * BOID_SIZE);
            tree.add(boid);
            boids.push(boid);
        }

        const counter = document.getElementById("counter")
        counter.textContent = "Boid Count: " + boids.length;
        if(boids.length == MAX_BOID_COUNT) {
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

        if(sketch.key === 'r') {
            newSimulation();
        }
    }

    function newSimulation() {
        boids.length = 0;
        tree.clear();
        
        // initialize boids at random positions
        for (let i = 0; i < INIT_BOID_COUNT; i++) {
            const boid = new Boid(Math.random() * width, Math.random() * height, SPEED, sketch, BOID_SIZE * BOID_SIZE);
            tree.add(boid);
            boids.push(boid);
        };

        tree.add(testBoid);
    }

    // renders given boid
    function drawBoid(boid) {
        //sketch.circle(boid.position.x, boid.position.y, SIZE - 2);

        const dirVector = boid.velocity.copy();
        dirVector.setMag(BOID_SIZE);
        let angle = dirVector.heading();

        if (angle > 180) {
            angle -= 180;
        }

        angle = 180 - (angle + 90);

        const xOffset = BOID_SIZE / 2 * sketch.cos(angle);
        const yOffset = BOID_SIZE / 2 * sketch.sin(angle);

        sketch.triangle(boid.position.x + dirVector.x * 1.5, boid.position.y + dirVector.y * 1.5,
            boid.position.x - xOffset, boid.position.y + yOffset,
            boid.position.x + xOffset, boid.position.y - yOffset);
    }

    // wraps boid to other side of window once at the edge
    function wrapBoid(boid) {
        if (boid.position.x > width) {
            boid.x = 0;
        }

        if (boid.position.y > height) {
            boid.y = 0;
        }

        if (boid.position.x < 0) {
            boid.x = width;
        }

        if (boid.position.y < 0) {
            boid.y = height;
        }
    }

};

let myp5 = new p5(s);