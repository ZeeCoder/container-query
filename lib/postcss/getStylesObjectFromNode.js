'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getStylesObjectFromNode;

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _isValueUsingContainerUnits = require('./isValueUsingContainerUnits');

var _isValueUsingContainerUnits2 = _interopRequireDefault(_isValueUsingContainerUnits);

var _detectContainerDefinition = require('./detectContainerDefinition');

var _detectContainerDefinition2 = _interopRequireDefault(_detectContainerDefinition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a styles object from the css declarations found in the given rule
 * node.
 *
 * @param {Node} ruleNode
 * @param {bool} [onlyContainerUnits]
 *
 * @throws Error if the ruleNode is not actually a rule
 * @throws Error if onlyContainerUnits is true, and ruleNode is a container
 * where container units were found to be used with either the `width` or
 * `height` properties.
 *
 * @returns {Object}
 */
function getStylesObjectFromNode(ruleNode) {
    var onlyContainerUnits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (ruleNode.type !== 'rule') {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    var styles = {};
    var isContainer = (0, _detectContainerDefinition2.default)(ruleNode) !== null;

    if (Array.isArray(ruleNode.nodes)) {
        ruleNode.nodes.forEach(function ( /** Node */node) {
            if (node.type !== 'decl' || onlyContainerUnits && !(0, _isValueUsingContainerUnits2.default)(node.value)) {
                return;
            }

            if (onlyContainerUnits && isContainer && ['width', 'height'].indexOf(node.prop) !== -1) {
                // @todo more helpful message here
                throw new Error('A container cannot use container units for its width and/or height properties.');
            }

            styles[(0, _lodash2.default)(node.prop)] = node.value;
        });
    }

    return styles;
}