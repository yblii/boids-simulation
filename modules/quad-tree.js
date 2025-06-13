import { Node } from "./node.js";
import { Bound } from "./bound.js";

// A QuadTree that stores objects based on their position in the given 2 dimensional bound. 
export class QuadTree {
    constructor(factor, bound) {
        this.root = undefined;
        this.splittingFactor = factor;
        this.bound = bound;
        this.minWidth = bound.width / 50;
    }

    add(obj) {
        this.addHelper(obj, this.root);
    }

    // Adds an object into the QuadTree, dividing nodes into quadrants if the splittingFactor
    // is exceeded.
    addHelper(obj, node) {
        if(this.root === undefined) {
            this.root = new Node(this.bound, [obj], undefined);
            obj.parentNode = this.root;
        } else {
            let currNode = node;
            const x = obj.position.x;
            const y = obj.position.y;
            
            // goes to deepest level containing the given object
            while(currNode.isParent === true) {
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
            obj.parentNode = currNode;

            if(this.canSplit(currNode)) {
                this.splitNode(currNode);
            }
        }
    }

    // Splits the given node by assigning it 4 children who represent each of the original
    // node's quadrants. Any objects in the original node are moved to its children.
    splitNode(node) {
        const xDivider = node.bound.getMidX();
        const yDivider = node.bound.getMidY();

        const NW = new Node(new Bound(node.bound.x1, xDivider, 
                node.bound.y1, yDivider), [], node);
        const NE = new Node(new Bound(xDivider, node.bound.x2, 
                node.bound.y1, yDivider), [], node);
        const SW = new Node(new Bound(node.bound.x1, xDivider, 
                yDivider, node.bound.y2), [], node);
        const SE = new Node(new Bound(xDivider, node.bound.x2, 
                yDivider, node.bound.y2), [], node);

        for(const obj of node.data) {
            if(NW.bound.contains(obj.position)) {
                NW.add(obj);
                obj.parentNode = NW;

                if(this.canSplit(NW)) {
                    this.splitNode(NW);
                }
            } else if(NE.bound.contains(obj.position)) {
                NE.add(obj);
                obj.parentNode = NE;

                if(this.canSplit(NE)) {
                    this.splitNode(NE);
                }
            } else if(SW.bound.contains(obj.position)) {
                SW.add(obj);
                obj.parentNode = SW;

                if(this.canSplit(SW)) {
                    this.splitNode(SW);
                }
            } else {
                SE.add(obj);
                obj.parentNode = SE;

                if(this.canSplit(SE)) {
                    this.splitNode(SE);
                }
            }
        }

        node.isParent = true;
        node.setChildren(NW, NE, SW, SE);
        node.clearData(); // parent nodes contain no data
    }

    // Checks if the given node can be split. A node can be split if it contains more objects than
    // the splittingFactor and its width is larger than the minimum width.
    canSplit(node) {
        return node.size >= this.splittingFactor && node.bound.width > this.minWidth;
    }

    // Updates the node that the given object is stored in
    update(obj) {
        let node = obj.parentNode;
        node.remove(obj);
        
        this.tryCollapse(node.parentNode);

        // finds smallest parent node that contains the obj
        while(!node.bound.contains(obj)) {
            node = node.parentNode;
        }

        this.addHelper(obj, node);
    }

    // collapses the highest empty parentNode from the given node
    tryCollapse(node) {
        if(node === undefined || !node.isEmpty()) return;
        
        while(node.parentNode != undefined && node.parentNode.isEmpty()) {
            node = node.parentNode;
        }

        node.collapse();
    }

    // Given a p5 sketch object, draws a visual representation of the regions split by each node.
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
    
    // TODO: get neighbors
}