/**
 * @class
 * @property {Node[]} nodes
 */
export default class Root {
    /**
     * @param {Object} [source]
     */
    constructor (source) {
        this.type = 'root';
        this.nodes = [];
        this.source = {
            input: {
                file: 'non/existent/file/path.css',
            },
        };
    }

    /**
     * @param {Node} node
     *
     * @returns {Node}
     */
    addNode (node) {
        node.parent = this;

        this.nodes.push(node);

        return this;
    }

    walk (cb) {
        this.nodes.forEach(cb);
    }
}
