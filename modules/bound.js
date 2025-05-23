export class Bound {
    constructor(x1, x2, y1, y2) {
        if(x2 < x1 || y2 < y1) {
            throw new Error("invalid coordinates");
        }

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    contains(pos) {
        if(pos.x >= x1 && pos.x < x2 && pos.y >= y1 && pos.y < y2 ) {
            return true;
        }
        return false;
    }

    getMidX() {
        return x1 + (x2 - x1) / 2;
    }

    getMidY() {
        return y1 + (y2 - y1) / 2;
    }
}