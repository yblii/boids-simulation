export class Boid {
    constructor(x, y, speed, p5) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.p5 = p5;
        this.velocity = p5.createVector(0.5, 0.5);

        this.parentNode = undefined;
    }

    get position() {
        return {x: this.x, y: this.y};
    }


    update(neighbors) {
        if(neighbors.length > 0) {
            this.steerToCenter(neighbors);
            this.align(neighbors);
            this.separate(neighbors);
        }

        this.velocity.setMag(this.speed);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    steerToCenter(neighbors) {
        // average position of neighbors
        let centerX = 0;
        let centerY = 0;

        for(const boid of neighbors) {
            centerX += boid.x;
            centerY += boid.y;
        }

        centerX /= neighbors.length;
        centerY /= neighbors.length;

        const diff = this.p5.createVector(centerX - this.x, centerY - this.y);

        this.velocity.add(diff.mult(0.005));
    }

    align(neighbors) {
        const aveVelocity = this.p5.createVector(0, 0);

        for(const boid of neighbors) {
            aveVelocity.add(boid.velocity);
        }

        aveVelocity.mult(1 / neighbors.length);
        
        aveVelocity.sub(this.velocity);
        this.velocity.add(aveVelocity.mult(0.05));
    }

    separate(neighbors) {
        for(const boid of neighbors) {
            if(this.distBetween(boid) < 500) {
                const diff = this.p5.createVector(boid.x - this.x, boid.y - this.y);
                this.velocity.sub(diff.mult(0.005));
            }
        }
    }

    distBetween(other) {
        return (other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y);
    }

    debug(sketch) {
        sketch.stroke('red');
        this.p5.line(this.x, this.y, this.x + this.velocity.x * 5, this.y + this.velocity.y * 5);
        sketch.stroke('black');
        
    }
}