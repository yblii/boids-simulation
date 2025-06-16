import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = ( sketch ) => {
  const WIDTH = 1000;
  const HEIGHT = 1000;
  const PARTICLE_COUNT = 50;
  const SPLITTING_FACTOR = 3;

  const PARTICLES = [];
  const TREE = new QuadTree(SPLITTING_FACTOR, new Bound(0, WIDTH, 0, HEIGHT));

  for(let i = 0; i < PARTICLE_COUNT; i++) {
    const boid = new Boid(Math.random() * 400 + 200, Math.random() * 400 + 200, 2, sketch);
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
      if(!boid.parentNode.bound.contains(boid.position)) {
        TREE.update(boid);
      }
      sketch.circle(boid.position.x, boid.position.y, 10);
      boid.debug(sketch);
    }
  };
};

let myp5 = new p5(s);