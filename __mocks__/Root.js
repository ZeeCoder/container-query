/**
 * @class
 * @property {Node[]} nodes
 */
export default class Root {
    constructor () {
        this.nodes = [];
    }

    /**
     * @param {Node} node
     *
     * @returns {Node}
     */
    addNode (node) {
        this.nodes.push(node);

        return this;
    }

    walk (cb) {
        this.nodes.forEach(cb);
    }
}
