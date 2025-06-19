export class Boid {
    constructor(x, y, speed, p5, minDist) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.p5 = p5;
        this.velocity = p5.createVector(0.5, 0.5);
        this.minDist = minDist
        this.parentNode = undefined;
    }

    get position() {
        return { x: this.x, y: this.y };
    }

    update(neighbors) {
        if (neighbors.length > 0) {
            this.updateVelocity(neighbors);
        }

        this.velocity.limit(this.speed);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    updateVelocity(neighbors) {
        // center of surrounding boids (for coherence)
        let centerX = 0;
        let centerY = 0;

        // average direction of surrounding boids (for alignment)
        const aveVelocity = this.p5.createVector(0, 0);

        // where to steer to avoid other boids (for separation)
        const avoidance = this.p5.createVector(0, 0);

        for (const boid of neighbors) {
            centerX += boid.x;
            centerY += boid.y;

            aveVelocity.add(boid.velocity);

            // checking if nearby boids are too close
            if (this.distBetween(boid) < this.minDist * 1.5) {
                avoidance.add(this.p5.createVector(boid.x - this.x, boid.y - this.y));
            }
        }

        centerX /= neighbors.length;
        centerY /= neighbors.length;

        // distance from center of surrounding boids to this one
        const diff = this.p5.createVector(centerX - this.x, centerY - this.y);

        const finalOffset = this.p5.createVector(0, 0);
        finalOffset.add(diff.mult(0.005));
        finalOffset.sub(avoidance.mult(0.04));
        finalOffset.add(aveVelocity.mult(0.005));

        this.velocity.add(finalOffset);
    }

    distBetween(other) {
        return (other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y);
    }

    debug(sketch) {
        sketch.stroke('red');
        sketch.line(this.x, this.y, this.x + this.velocity.x * 5, this.y + this.velocity.y * 5);
        sketch.stroke('black');
    }
}