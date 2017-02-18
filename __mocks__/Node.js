/**
 * @class
 * @property {string} selector
 * @property {string} name
 * @property {string} type
 * @property {string} prop
 * @property {string} value
 * @property {Node[]} nodes
 */
export default class Node {
    /**
     * @param {{
     *   [selector]: string,
     *   [name]: string,
     *   [type]: string,
     *   [prop]: string,
     *   [value]: string,
     * }} props
     */
    constructor (props) {
        this.nodes = [];
        this.selector = props.selector;
        this.name = props.name;
        this.type = props.type;
        this.prop = props.prop;
        this.value = props.value;
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
