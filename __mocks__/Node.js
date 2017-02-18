/**
 * @class
 * @property {string} selector
 * @property {string} name
 * @property {string} type
 * @property {Node[]} nodes
 */
export default class Node {
    /**
     * @param {{
     *   [selector]: string,
     *   [name]: string,
     *   [type]: string,
     * }} props
     */
    constructor (props) {
        this.nodes = [];
        this.selector = props.selector;
        this.name = props.name;
        this.type = props.type;
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
}
