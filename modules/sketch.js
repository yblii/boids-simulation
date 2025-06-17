import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = ( sketch ) => {
  const WIDTH = sketch.windowWidth;
  const HEIGHT = sketch.windowHeight;
  const MARGIN = 10;

  const PARTICLE_COUNT = 50;
  const SPLITTING_FACTOR = 3;
  const SPEED = 2;

  const PARTICLES = [];
  const TREE = new QuadTree(SPLITTING_FACTOR, new Bound(0 - MARGIN, WIDTH + MARGIN, 0 - MARGIN, HEIGHT + MARGIN));

  // initialize boids at random positions
  for(let i = 0; i < PARTICLE_COUNT; i++) {
    const boid = new Boid(Math.random() * 400 + 200, Math.random() * 400 + 200, SPEED, sketch);
    TREE.add(boid);
    PARTICLES.push(boid);
  };

  sketch.setup = () => {
    sketch.createCanvas(WIDTH, HEIGHT);
    sketch.background(0);
  };

  sketch.draw = () => {
    sketch.background(0);
    sketch.fill(255);
    
    for(const boid of PARTICLES) {
      boid.update(TREE.getNeighbors(boid));

      if(boid.position.x > WIDTH) {
        boid.x = 0;
      }

      if(boid.position.y > HEIGHT) {
        boid.y = 0;
      }

      if(boid.position.x < 0) {
        boid.x = WIDTH;
      }

      if(boid.position.y < 0) {
        boid.y = HEIGHT;
      }

      if(!boid.parentNode.bound.contains(boid.position)) {
        TREE.update(boid);
      }

      sketch.circle(boid.position.x, boid.position.y, 10);
    }
  };
};

let myp5 = new p5(s);