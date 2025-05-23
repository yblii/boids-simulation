// represents a node in a QuadTree
export class Node {
    // constructs a node with the given bound and data and no children
    // Input: Bound bound - a valid bound representing the region of this node, required
    //        Object[] data - an array of objects to be contained within this node, optional
    constructor(bound, data) {
        if(bound === undefined) {
            throw new Error("bounds required");
        }

        this.bound = bound;

        if(data != undefined) {
            this.data = data;
            this.size = data.length;
        } else {
            this.size = 0;
            this.data = [];
        }

        this.isParent = false;
        this.NW = undefined;
        this.NE = undefined;
        this.SW = undefined;
        this.SE = undefined;
    }
    
    get getData() {
        return this.data;
    }

    get getSize() {
        return this.size;
    }

    add(obj) {
        this.data.push(obj);
        this.size++;
    }
}