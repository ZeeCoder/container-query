import { DEFINE_CONTAINER_NAME } from "../constants";

/**
 * @param {Node} ruleNode
 *
 * @returns {string|null}
 */
export default function detectContainerDefinition (ruleNode) {
    let container = null;

    const nodesLength = ruleNode.nodes.length;
    for (let i = 0; i < nodesLength; i++) {
        if (
            ruleNode.nodes[i].type === 'atrule' &&
            ruleNode.nodes[i].name === DEFINE_CONTAINER_NAME
        ) {
            container = ruleNode.selector;
            break;
        }
    }

    return container;
}
