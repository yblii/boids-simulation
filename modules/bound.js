export class Bound {
    constructor(x1, x2, y1, y2) {
        if(x2 < x1 || y2 < y1) {
            throw new Error("invalid coordinates");
        }

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.width = x2 - x1;
        this.height = y2 - y1;
    }

    contains(pos) {
        if(pos.x >= this.x1 && pos.x < this.x2 && pos.y >= this.y1 && pos.y < this.y2 ) {
            return true;
        }
        return false;
    }

    getMidX() {
        return this.x1 + (this.x2 - this.x1) / 2;
    }

    getMidY() {
        return this.y1 + (this.y2 - this.y1) / 2;
    }
}