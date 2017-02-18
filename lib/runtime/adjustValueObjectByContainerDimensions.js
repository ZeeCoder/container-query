'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = adjustValueObjectByContainerDimensions;

var _convertCompositValuesToPixel = require('./convertCompositValuesToPixel');

var _convertCompositValuesToPixel2 = _interopRequireDefault(_convertCompositValuesToPixel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {ContainerDimensions} containerDimensions
 * @param {Object} valueDefinition
 * Ex:
 * `{
 *   fontSize: "1<HEIGHT_UNIT>",
 *   padding: "10<HEIGHT_UNIT> 10<WIDTH_UNIT>",
 * }`
 *
 * @returns {Object}
 * Ex:
 * `{
 *   fontSize: "10px",
 *   padding: "10px 20px",
 * }`
 */
function adjustValueObjectByContainerDimensions(containerDimensions, valueDefinition) {
    var values = Object.assign({}, valueDefinition);

    for (var cssRule in values) {
        values[cssRule] = (0, _convertCompositValuesToPixel2.default)(containerDimensions, values[cssRule]);
    }

    return values;
}