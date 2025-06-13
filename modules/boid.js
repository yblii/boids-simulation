export class Boid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0.5;
        this.dy = 0.5;

        this.parentNode = undefined;
    }

    get position() {
        return {x: this.x, y: this.y};
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
}