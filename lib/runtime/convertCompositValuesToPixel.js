'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = convertCompositValuesToPixel;

var _constants = require('../constants');

var _convertSingleValueToPixel = require('./convertSingleValueToPixel');

var _convertSingleValueToPixel2 = _interopRequireDefault(_convertSingleValueToPixel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param  {ContainerDimensions} dimensions
 * @param  {string} compositValue Ex: "10<HEIGHT_UNIT> 5<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px 10px 42px"
 */
function convertCompositValuesToPixel(dimensions, compositValue) {
    var valArr = [];
    var match = void 0;

    match = compositValue.match(new RegExp('\\d+' + _constants.HEIGHT_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    match = compositValue.match(new RegExp('\\d+' + _constants.WIDTH_UNIT, 'g'));
    if (match !== null) {
        valArr = valArr.concat(match);
    }

    var convertedValues = {};
    valArr.forEach(function (value) {
        convertedValues[value] = (0, _convertSingleValueToPixel2.default)(dimensions, value);
    });

    var compositPixelValue = compositValue;

    for (var unconvertedValue in convertedValues) {
        compositPixelValue = compositPixelValue.replace(new RegExp(unconvertedValue, 'g'), convertedValues[unconvertedValue]);
    }

    return compositPixelValue;
}