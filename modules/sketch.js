import { QuadTree } from "./quad-tree.js";
import { Bound } from "./bound.js";
import { Boid } from "./boid.js";

const s = ( sketch ) => {
  const WIDTH = 500;
  const HEIGHT = 500;
  const PARTICLE_COUNT = 50;
  const SPLITTING_FACTOR = 1;

  const particles = [];
  const tree = new QuadTree(SPLITTING_FACTOR, new Bound(0, WIDTH, 0, HEIGHT));

  for(let i = 0; i < PARTICLE_COUNT; i++) {
    const boid = new Boid(Math.random() * 500, Math.random() * 500);
    tree.add(boid);
    particles.push(boid);
  }

  sketch.setup = () => {
    sketch.createCanvas(WIDTH, HEIGHT);
    sketch.background(0);
    tree.debug(sketch);
  };

  sketch.draw = () => {
    for(const boid of particles) {
      sketch.circle(boid.position.x, boid.position.y, 10);
    }
  };
};

let myp5 = new p5(s);