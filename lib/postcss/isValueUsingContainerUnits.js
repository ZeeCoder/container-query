'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isValueUsingContainerUnits;

var _constants = require('../constants');

/**
 * @param {String} value
 *
 * @returns {boolean}
 */
function isValueUsingContainerUnits(value) {
    return typeof value === 'string' && (value.indexOf(_constants.HEIGHT_UNIT) !== -1 || value.indexOf(_constants.WIDTH_UNIT) !== -1);
}