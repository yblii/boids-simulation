// represents a node in a QuadTree
export class Node {
    // constructs a leaf node with the given bound, data, parentNode, and 
    // position within the parentNode
    constructor(bound, data, parentNode, pos) {
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

        this.pos = pos;
    }

    // turns node into leaf node
    collapse() {
        this.NW = undefined;
        this.NE = undefined;
        this.SW = undefined;
        this.SE = undefined;
        this.isParent = false;
    }

    getData() {
        if(this.isParent) {
            return this.NW.data.concat(this.NE.data, this.SW.data, this.SE.data);
        }
        return this.data;
    }

    // removes given object from data
    remove(obj) {
        this.data = this.data.filter((elem) => elem !== obj);
        this.size--;
    }

    // sets children to given nodes
    setChildren(NW, NE, SW, SE) {
        this.isParent = true;
        this.NW = NW;
        this.NE = NE;
        this.SW = SW;
        this.SE = SE;
    }

    // adds object to node
    add(obj) {
        this.data.push(obj);
        this.size++;
        obj.parentNode = this;
    }

    // clears node data
    clearData() {
        this.data = [];
        this.size = 0;
    }

    // checks if node is completely empty (including all child nodes)
    isEmpty() {
        if(this.isParent) {
            return this.NE.isEmpty() && this.NW.isEmpty() && this.SE.isEmpty() && this.SW.isEmpty();
        }
        return this.size === 0;
    }
}