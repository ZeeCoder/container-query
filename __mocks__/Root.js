/**
 * @class
 * @property {Node[]} nodes
 */
export default class Root {
    /**
     * @param {Object} source
     */
    constructor (source) {
        this.nodes = [];
        this.source = source;
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
