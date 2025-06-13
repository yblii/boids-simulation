// represents a node in a QuadTree
export class Node {
    // constructs a node with the given bound and data and no children
    // Input: Bound bound - a valid bound representing the region of this node, required
    //        Object[] data - an array of objects to be contained within this node, optional
    constructor(bound, data, parentNode) {
        if(bound === undefined) {
            throw new Error("bounds required");
        }

        this.bound = bound;

        this.data = data;
        this.size = data.length;

        this.isParent = false;
        this.parentNode = parentNode;

        this.NW = undefined;
        this.NE = undefined;
        this.SW = undefined;
        this.SE = undefined;
    }

    collapse() {
        this.NW = undefined;
        this.NE = undefined;
        this.SW = undefined;
        this.SE = undefined;
        this.isParent = false;
    }

    remove(obj) {
        this.data = this.data.filter((elem) => elem !== obj);
        this.size--;
    }

    setChildren(NW, NE, SW, SE) {
        this.NW = NW;
        this.NE = NE;
        this.SW = SW;
        this.SE = SE;
    }

    add(obj) {
        this.data.push(obj);
        this.size++;
    }

    clearData() {
        this.data = [];
        this.size = 0;
    }

    isEmpty() {
        if(this.isParent) {
            return this.NE.isEmpty() && this.NW.isEmpty() && this.SE.isEmpty() && this.SW.isEmpty();
        }
        return this.size === 0;
    }
}