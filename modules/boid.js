// Represents a boid object that follows the boid flocking algorithm.
export class Boid {
    // constructs boid at given position with given speed
    // p5 reference used for vector calculations
    constructor(x, y, speed, p5, minDist) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.velocity = p5.createVector(0, 0);
        this.minDist = minDist

        this.p5 = p5;
        this.parentNode = undefined;
    }

    // returns current position of boid (x, y) in an object
    get position() {
        return { x: this.x, y: this.y };
    }

    // updates the boid's velocity and position given a list of neighboring boids and the 
    // user's mouse
    update(neighbors, mousePos) {
        // avoiding mouse
        if(mousePos != undefined && this.distBetween(mousePos) < this.minDist * 200) {
            const offset = this.p5.createVector(mousePos.x - this.x, mousePos.y - this.y);
            this.velocity.sub(offset.mult(100 / this.distBetween(mousePos)));
        }

        // updating velocity to follow rules of alignment, separation, and cohesion
        if (neighbors.length > 0) {
            this.updateVelocity(neighbors);
        }

        this.velocity.setMag(this.speed);

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    // updates the boid's velocity given a list of neighboring boids according to boid algorithm
    // rules
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
        const posOffset = this.p5.createVector(centerX - this.x, centerY - this.y);
        const velocityOffset = aveVelocity.sub(this.velocity);

        const finalOffset = this.p5.createVector(0, 0);
        finalOffset.add(posOffset.mult(0.005));
        finalOffset.sub(avoidance.mult(0.03));
        finalOffset.add(velocityOffset.mult(0.009));
        finalOffset.limit(this.speed * 0.1);

        this.velocity.add(finalOffset);
    }

    // returns the squared euclidean distance between this boid and other object
    distBetween(other) {
        return (other.x - this.x) * (other.x - this.x) + (other.y - this.y) * (other.y - this.y);
    }

    // a debug tool that will display the boid's velocity as a line
    debug(sketch) {
        sketch.stroke('red');
        sketch.line(this.x, this.y, this.x + this.velocity.x * 5, this.y + this.velocity.y * 5);
    }
}