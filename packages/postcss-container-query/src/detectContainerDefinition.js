import { DEFINE_CONTAINER_NAME } from "../../common/src/constants";

/**
 * @param {Node} ruleNode
 * @param {boolean} [removeDefinition]
 *
 * @returns {string|null} The container's selector
 */
export default function detectContainerDefinition(
    ruleNode,
    removeDefinition = true
) {
    let container = null;

    const nodesLength = ruleNode.nodes.length;
    let i = 0;
    for (i; i < nodesLength; i++) {
        if (
            ruleNode.nodes[i].type === "atrule" &&
            ruleNode.nodes[i].name === DEFINE_CONTAINER_NAME
        ) {
            container = ruleNode.selector;
            break;
        }
    }

    if (removeDefinition) {
        ruleNode.nodes.splice(i, 1);
    }

    return container;
}
