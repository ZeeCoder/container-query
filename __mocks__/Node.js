/**
 * @class
 * @property {string} selector
 * @property {string} params
 * @property {string} name
 * @property {string} type
 * @property {string} prop
 * @property {string} value
 * @property {Node[]} nodes
 * @property {Node} parent
 */
export default class Node {
    /**
     * @param {{
     *   [selector]: string,
     *   [params]: string,
     *   [name]: string,
     *   [type]: string,
     *   [prop]: string,
     *   [value]: string,
     *   [parent]: { type: string },
     * }} props
     */
    constructor (props) {
        this.nodes = [];
        this.selector = props.selector;
        this.params = props.params;
        this.name = props.name;
        this.type = props.type;
        this.prop = props.prop;
        this.value = props.value;
        this.parent = props.parent;
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

    error (message) {
        throw new Error(message);
    }

    remove () {
        // ...
    }
}
