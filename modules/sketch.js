import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

// this sketch object manages the quadtree, boids, and rendering
const s = (sketch) => {
    let width = sketch.windowWidth;
    let height = sketch.windowHeight;
    const MARGIN = 10; // used as a buffer when wrapping boids from one side of the window to the other

    const MAX_BOID_COUNT = 500;
    const INIT_BOID_COUNT = 40;
    const SPLITTING_FACTOR = 5; // how many boids can be in a quadtree node before it splits
    const SPEED = 7;
    const BOID_SIZE = 20;

    const boids = [];
    const tree = new QuadTree(SPLITTING_FACTOR, new Bound(0 - MARGIN, width + MARGIN, 0 - MARGIN, height + MARGIN));
    // used for debug mode
    const testBoid = new Boid(Math.random() * width, Math.random() * height, SPEED, sketch, BOID_SIZE * BOID_SIZE);

    // state variables
    let debugOn = false;
    let avoidCursorOn = true;

    sketch.setup = () => {
        sketch.createCanvas(width, height);
        sketch.background(136, 198, 219);
        sketch.angleMode(sketch.DEGREES);
        resetSimulation();
    };

    sketch.draw = () => {
        sketch.background(136, 198, 219);

        // renders debug mode
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

        // updates every boid's position and renders it
        for (const boid of boids) {
            if(avoidCursorOn) {
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

        updateCounterDisplay();
    };

    // detects key presses and updates simulation settings accordingly
    sketch.keyPressed = () => {
        if(sketch.key === 's') {
            avoidCursorOn = !avoidCursorOn;
        }

        if(sketch.key === 'd') {
            debugOn = !debugOn;
        }

        if(sketch.key === 'r') {
            resetSimulation();
        }
    }

    // detects window being resized and updates quadtree bounds with current boids
    sketch.windowResized = () => {
        width = sketch.windowWidth;
        height = sketch.windowHeight;

        sketch.resizeCanvas(width, height);

        console.log(width + ", " + height);

        tree.clear();
        tree.updateBounds(new Bound(0 - MARGIN, width + MARGIN, 0 - MARGIN, height + MARGIN));

        for(const boid of boids) {
            if(!tree.bound.contains(boid.position)) {
                boid.x = width / 2;
                boid.y = height / 2;
            }
            tree.add(boid);
        }

        if(!tree.bound.contains(testBoid.position)) {
            testBoid.x = width / 2;
            testBoid.y = height / 2;
        }
        tree.add(testBoid);
    }

    // updates the boid counter html element with the current count
    function updateCounterDisplay() {
        const counter = document.getElementById("counter")
        counter.textContent = "Boid Count: " + boids.length;
        if(boids.length == MAX_BOID_COUNT) {
            counter.textContent += " (MAX)";
        }
    }

    // resets the simulation by deleting current boids and initializing new ones
    function resetSimulation() {
        boids.length = 0;
        tree.clear();
        
        // initialize boids at random positions
        for (let i = 0; i < INIT_BOID_COUNT; i++) {
            const boid = new Boid(Math.random() * width, Math.random() * height, 
                    SPEED, sketch, BOID_SIZE * BOID_SIZE);
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