import { Node } from "./node.js";
import { Bound } from "./bound.js";
import { Dir } from "./directions.js";
import { Pos } from "./positions.js";

// A QuadTree that stores objects based on their position in the given 2 dimensional bound
export class QuadTree {
    constructor(factor, bound) {
        this.root = undefined;
        this.splittingFactor = factor;
        this.bound = bound;
        this.minWidth = bound.width / 20;
    }
    
    // Adds an object into the QuadTree
    add(obj) {
        this.addHelper(obj, this.root);
    }

    // Adds an object into the QuadTree, dividing nodes into quadrants if the splittingFactor
    // is exceeded
    addHelper(obj, node) {
        if(this.root === undefined) {
            this.root = new Node(this.bound, [obj], undefined, undefined);
            obj.parentNode = this.root;
        } else {
            let currNode = node;
            const x = obj.position.x;
            const y = obj.position.y;
            
            // goes to deepest level containing the given object
            while(currNode.isParent === true) {
                const xDivider = currNode.bound.getMidX();
                const yDivider = currNode.bound.getMidY();

                // in NW quadrant of node
                if(x < xDivider && y < yDivider) {
                    currNode = currNode.NW;
                } else if(x < xDivider && y >= yDivider) { // in SW
                    currNode = currNode.SW;
                } else if(x >= xDivider && y < yDivider)  { // in NE
                    currNode = currNode.NE;
                } else { // in SE
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
                node.bound.y1, yDivider), [], node, Pos.NW);
        const NE = new Node(new Bound(xDivider, node.bound.x2, 
                node.bound.y1, yDivider), [], node, Pos.NE);
        const SW = new Node(new Bound(node.bound.x1, xDivider, 
                yDivider, node.bound.y2), [], node, Pos.SW);
        const SE = new Node(new Bound(xDivider, node.bound.x2, 
                yDivider, node.bound.y2), [], node, Pos.SE);

        for(const obj of node.data) {
            if(NW.bound.contains(obj.position)) {
                NW.add(obj);

                if(this.canSplit(NW)) {
                    this.splitNode(NW);
                }
            } else if(NE.bound.contains(obj.position)) {
                NE.add(obj);

                if(this.canSplit(NE)) {
                    this.splitNode(NE);
                }
            } else if(SW.bound.contains(obj.position)) {
                SW.add(obj);

                if(this.canSplit(SW)) {
                    this.splitNode(SW);
                }
            } else {
                SE.add(obj);

                if(this.canSplit(SE)) {
                    this.splitNode(SE);
                }
            }
        }

        node.setChildren(NW, NE, SW, SE);
        node.clearData(); // parent nodes contain no data
    }

    // Checks if the given node can be split. A node can be split if it contains more objects than
    // the splittingFactor and its width is larger than the minimum width.
    canSplit(node) {
        return node.size >= this.splittingFactor && node.bound.width > this.minWidth;
    }

    // Updates the given object's location in tree
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
        
    // returns list of objects in nodes adjacent to given obj
    getNeighbors(obj) {
        const node = obj.parentNode;
        const adjNodes = this.getSurrounding(node);

        let data = [];

        for(const node of adjNodes) {
            if(node !== undefined) {
                data = data.concat(node.getData());
            }
        }
        return data;
    }

    // returns a list of the nodes surrounding the given node (includes given node)
    getSurrounding(node) {
        let nodes = [node];
        const up = this.getAdjacent(node, Dir.UP);
        const down = this.getAdjacent(node, Dir.DOWN);
        const left = this.getAdjacent(node, Dir.LEFT);
        const right = this.getAdjacent(node, Dir.RIGHT);

        nodes.push(up);
        nodes.push(down);
        nodes.push(left);
        nodes.push(right);
        nodes.push(this.getAdjacent(up, Dir.LEFT));
        nodes.push(this.getAdjacent(up, Dir.RIGHT));
        nodes.push(this.getAdjacent(down, Dir.LEFT));
        nodes.push(this.getAdjacent(down, Dir.RIGHT));

        return nodes;
    }
    
    // Given a node and a direction, returns the node adjacent to the given node in the 
    // given direction. If the desired node is not within the quadtree, will return undefined.
    getAdjacent(node, dir) {
        if(node === undefined || node.pos === undefined) { return; }
        
        const parent = node.parentNode;

        if(node.pos === Pos.NW) {
            switch(dir) {
                case Dir.UP:
                    const upperNeighbor = this.getAdjacent(parent, dir);
                    if(upperNeighbor !== undefined && upperNeighbor.isParent) {
                        return upperNeighbor.SW;
                    }
                    return upperNeighbor;
                case Dir.DOWN:
                    return parent.SW;
                case Dir.LEFT:
                    const leftNeighbor = this.getAdjacent(parent, dir);
                    if(leftNeighbor !== undefined && leftNeighbor.isParent) {
                        return leftNeighbor.NE;
                    }
                    return leftNeighbor;
                case Dir.RIGHT:
                    return parent.NE;
            }
        } else if(node.pos === Pos.NE) {
            switch(dir) {
                case Dir.UP:
                    const upperNeighbor = this.getAdjacent(parent, dir);
                    if(upperNeighbor !== undefined && upperNeighbor.isParent) {
                        return upperNeighbor.SE;
                    }
                    return upperNeighbor;
                case Dir.DOWN:
                    return parent.SE;
                case Dir.LEFT:
                    return parent.NW;
                case Dir.RIGHT:
                    const rightNeighbor = this.getAdjacent(parent, dir);
                    if(rightNeighbor !== undefined && rightNeighbor.isParent) {
                        return rightNeighbor.NW;
                    }
                    return rightNeighbor;
            }
        } else if(node.pos === Pos.SW) {
            switch(dir) {
                case Dir.UP:
                    return parent.NW;
                case Dir.DOWN:
                    const lowerNeighbor = this.getAdjacent(parent, dir);
                    if(lowerNeighbor !== undefined && lowerNeighbor.isParent) {
                        return lowerNeighbor.NW;
                    }
                    return lowerNeighbor;
                case Dir.LEFT:
                    const leftNeighbor = this.getAdjacent(parent, dir);
                    if(leftNeighbor !== undefined && leftNeighbor.isParent) {
                        return leftNeighbor.SE;
                    }
                    return leftNeighbor;
                case Dir.RIGHT:
                    return parent.SE;
            }
        } else {
            switch(dir) {
                case Dir.UP:
                    return parent.NE;
                case Dir.DOWN:
                    const lowerNeighbor = this.getAdjacent(parent, dir);
                    if(lowerNeighbor !== undefined && lowerNeighbor.isParent) {
                        return lowerNeighbor.NE;
                    }
                    return lowerNeighbor;
                case Dir.LEFT: 
                    return parent.SW;
                case Dir.RIGHT:
                    const rightNeighbor = this.getAdjacent(parent, dir);
                    if(rightNeighbor !== undefined && rightNeighbor.isParent) {
                        return rightNeighbor.SW;
                    }
                    return rightNeighbor;
            }
        }
    }

    // clears current quadtree
    clear() {
        this.root = undefined;
    }

    // Given a p5 sketch object, draws a visual representation of the regions split by each node.
    debug(sketch) {
        sketch.noFill();
        sketch.stroke('black');
        sketch.strokeWeight(1);

        this.debugHelper(sketch, this.root);
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

    debugNeighbors(sketch, obj) {
        sketch.fill('red');
        for(const curr of this.getSurrounding(obj.parentNode)) {
            if(curr !== undefined)
                sketch.rect(curr.bound.x1, curr.bound.y1, curr.bound.width, curr.bound.height);
        }

        sketch.fill('blue');
        const curr = obj.parentNode;
        sketch.rect(curr.bound.x1, curr.bound.y1, curr.bound.width, curr.bound.height);
    }
}