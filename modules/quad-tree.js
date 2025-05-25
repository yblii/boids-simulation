import { Node } from "./node.js";
import { Bound } from "./bound.js";

export class QuadTree {
    constructor(factor, bound) {
        this.root = undefined;
        this.splittingFactor = factor;
        this.bound = bound;
    }

    // adds an object into the QuadTree
    add(obj) {
        if(this.root === undefined) {
            this.root = new Node(this.bound, [obj]);
        } else {
            let currNode = this.root;
            const x = obj.position.x;
            const y = obj.position.y;
            
            while(currNode.isParent == true) {
                const xDivider = currNode.bound.getMidX();
                const yDivider = currNode.bound.getMidY();

                // in top left quadrant of node
                if(x < xDivider && y < yDivider) {
                    currNode = currNode.NW;
                } else if(x < xDivider && y >= yDivider) { // in bottom left
                    currNode = currNode.SW;
                } else if(x > xDivider && y < yDivider)  { // in top right
                    currNode = currNode.NE;
                } else { // in bottom right
                    currNode = currNode.SE;
                }
            }

            currNode.add(obj);
            if(currNode.size >= this.splittingFactor) {
                const xDivider = currNode.bound.getMidX();
                const yDivider = currNode.bound.getMidY();

                const NW = new Node(new Bound(currNode.bound.x1, xDivider, 
                        currNode.bound.y1, yDivider));
                const NE = new Node(new Bound(xDivider, currNode.bound.x2, 
                        currNode.bound.y1, yDivider));
                const SW = new Node(new Bound(currNode.bound.x1, xDivider, 
                        yDivider, currNode.bound.y2));
                const SE = new Node(new Bound(xDivider, currNode.bound.x2, 
                        yDivider, currNode.bound.y2));

                for(const obj of currNode.getData) {
                    if(NW.bound.contains(obj.position)) {
                        NW.add(obj);
                    } else if(NE.bound.contains(obj.position)) {
                        NE.add(obj);
                    } else if(SW.bound.contains(obj.position)) {
                        SW.add(obj);
                    } else {
                        SE.add(obj);
                    }
                }

                currNode.isParent = true;
                currNode.setChildren(NW, NE, SW, SE);
            }
        }
    }

    debug(sketch) {
        sketch.noFill();
        sketch.stroke('red');
        sketch.strokeWeight(1);

        this.debugHelper(sketch, this.root);

        sketch.fill(255);
        sketch.stroke('black');
        sketch.strokeWeight(1);
    }

    debugHelper(sketch, curr) {
        sketch.rect(curr.bound.x1, curr.bound.y1, curr.bound.width, curr.bound.height); 

        if(curr.isParent) {
           this.debugHelper(sketch, curr.NE);
           this.debugHelper(sketch, curr.NW);
           this.debugHelper(sketch, curr.SE);
           this.debugHelper(sketch, curr.SW);
        }
    }
    // get potential neighbors    
}