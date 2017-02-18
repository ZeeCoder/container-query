'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extractContainerUnitStylesFromRule;

var _isValueUsingContainerUnits = require('./isValueUsingContainerUnits');

var _isValueUsingContainerUnits2 = _interopRequireDefault(_isValueUsingContainerUnits);

var _detectContainerDefinition = require('./detectContainerDefinition');

var _detectContainerDefinition2 = _interopRequireDefault(_detectContainerDefinition);

var _getStylesObjectFromNode = require('./getStylesObjectFromNode');

var _getStylesObjectFromNode2 = _interopRequireDefault(_getStylesObjectFromNode);

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
    var styles = (0, _getStylesObjectFromNode2.default)(ruleNode);
    var isContainer = (0, _detectContainerDefinition2.default)(ruleNode) !== null;

    for (var prop in styles) {
        if (!(0, _isValueUsingContainerUnits2.default)(styles[prop])) {
            delete styles[prop];
            continue;
        }

        if (isContainer && ['width', 'height'].indexOf(prop) !== -1) {
            // @todo more helpful message here
            throw new Error('A container cannot use container units for its width and/or height properties.');
        }
    }

    return styles;
}