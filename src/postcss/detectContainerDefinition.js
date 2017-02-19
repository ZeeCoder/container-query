import { DEFINE_CONTAINER_NAME } from "../constants";

/**
 * @param {Node} ruleNode
 * @param {boolean} [removeDefiniton]
 *
 * @returns {string|null}
 */
export default function detectContainerDefinition (ruleNode, removeDefiniton = true) {
    let container = null;

    const nodesLength = ruleNode.nodes.length;
    let i = 0;
    for (i; i < nodesLength; i++) {
        if (
            ruleNode.nodes[i].type === 'atrule' &&
            ruleNode.nodes[i].name === DEFINE_CONTAINER_NAME
        ) {
            container = ruleNode.selector;
            break;
        }
    }

    if (removeDefiniton) {
        ruleNode.nodes.splice(i, 1);
    }

    return container;
}
