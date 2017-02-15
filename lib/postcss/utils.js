'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.detectContainerDefinition = detectContainerDefinition;
/**
 * @param ruleNode
 *
 * @returns {string|null}
 */
function detectContainerDefinition(ruleNode) {
    var container = null;

    var nodesLength = ruleNode.nodes.length;
    for (var i = 0; i < nodesLength; i++) {
        if (ruleNode.nodes[i].type === 'atrule' && ruleNode.nodes[i].name === 'define-container') {
            container = ruleNode.selector;
            break;
        }
    }

    return container;
}