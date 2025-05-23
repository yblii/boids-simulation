export class Boid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 3;
        this.dy = 3;
    }

    get position() {
        return {x: this.x, y: this.y};
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
}