import { DEFINE_CONTAINER_NAME, CONTAINER_QUERY } from "../src/constants";

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
     *   [source]: object,
     * }} props
     */
    constructor(props) {
        this.nodes = props.nodes || [];
        this.selector = props.selector;
        this.params = props.params;
        this.name = props.name;
        this.type = props.type;
        this.prop = props.prop;
        this.value = props.value;
        this.parent = props.parent;
        this.source = props.source;
    }

    /**
     * @param {Node} node
     *
     * @returns {Node}
     */
    addNode(node) {
        node.parent = this;

        this.nodes.push(node);

        return this;
    }

    addDeclaration(prop = "", value = "") {
        this.addNode(
            new Node({
                type: "decl",
                prop,
                value
            })
        );
        return this;
    }

    addAtRule(name, params = "") {
        this.addNode(
            new Node({
                type: "atrule",
                name,
                params
            })
        );
        return this;
    }

    addComment() {
        this.addNode(
            new Node({
                type: "comment"
            })
        );
        return this;
    }

    addContainerDefinition() {
        return this.addAtRule(DEFINE_CONTAINER_NAME);
    }

    addContainerQuery(params) {
        return this.addAtRule(CONTAINER_QUERY, params);
    }

    walk(cb) {
        this.nodes.forEach(cb);
    }

    error(message) {
        throw new Error(message);
    }

    remove() {
        // ...
    }
}
