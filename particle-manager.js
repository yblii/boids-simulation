import { Boid } from "./modules/boid";
import { QuadTree } from "./modules/quad-tree";
import { Bound } from "./modules/bound";

class Manager {
    constructor(count, bound) {
        this.particles = [];
        for(let i = 0; i < count; i++) {
            this.particles.push(new Boid(i, i));
        }
    }

    render(sketch) {
    }
}