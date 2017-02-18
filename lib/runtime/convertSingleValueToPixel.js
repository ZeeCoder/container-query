'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = convertSingleValueToPixel;

var _constants = require('../constants');

/**
 * @param {ContainerDimensions} dimensions
 * @param {string} value Ex: "1<HEIGHT_UNIT>", "20<WIDTH_UNIT>"
 *
 * @return {string} Ex: "123px"
 */
function convertSingleValueToPixel(dimensions, value) {
    var isHeightUnit = value.indexOf(_constants.HEIGHT_UNIT) !== -1;

    var match = value.match(new RegExp('(\\d+)'));

    if (isHeightUnit) {
        return dimensions.height * parseInt(match[1]) / 100 + 'px';
    }

    return dimensions.width * parseInt(match[1]) / 100 + 'px';
}