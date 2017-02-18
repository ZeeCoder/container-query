'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extractContainerUnitStylesFromRule;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _isValueUsingContainerUnits = require('./isValueUsingContainerUnits');

var _isValueUsingContainerUnits2 = _interopRequireDefault(_isValueUsingContainerUnits);

var _detectContainerDefinition = require('./detectContainerDefinition');

var _detectContainerDefinition2 = _interopRequireDefault(_detectContainerDefinition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a styles object that contains only css declarations that use
 * container units.
 *
 * @param {Node} ruleNode
 *
 * @throws Error if ruleNode is a container and container units were found to be
 * used with either `width` or `height` properties.
 * @throws Error if the `ruleNode` is not actually a rule
 *
 * @returns {Object}
 */
function extractContainerUnitStylesFromRule(ruleNode) {
    if (ruleNode.type !== 'rule') {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    var styles = {};

    var isContainer = (0, _detectContainerDefinition2.default)(ruleNode) !== null;

    ruleNode.nodes.forEach(function (node) {
        if (node.type !== 'decl' || !(0, _isValueUsingContainerUnits2.default)(node.value)) {
            return;
        }

        if (isContainer && ['width', 'height'].indexOf(node.prop) !== -1) {
            // @todo more helpful message here
            throw new Error('A container cannot use container units for its width and/or height properties.');
        }

        styles[(0, _lodash2.default)(node.prop)] = node.value;
    });

    return styles;
}