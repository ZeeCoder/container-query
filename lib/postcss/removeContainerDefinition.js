"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = removeContainerDefinition;

var _constants = require("../constants");

/**
 * @param {Node} ruleNode
 *
 * @returns {string|null}
 */
function removeContainerDefinition(ruleNode) {
    var nodesLength = ruleNode.nodes.length;
    for (var i = 0; i < nodesLength; i++) {
        if (ruleNode.nodes[i].type === 'atrule' && ruleNode.nodes[i].name === _constants.DEFINE_CONTAINER_NAME) {
            ruleNode.nodes.splice(i, 1);
            break;
        }
    }
}