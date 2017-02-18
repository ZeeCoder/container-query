'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getConditionsFromQueryParams;

var _lodash = require('lodash.trim');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extracts conditions as arrays from a single "param" string PostCSS provides
 * for at-rules.
 *
 * @param {string} params
 *
 * @returns {string[]}
 */
function getConditionsFromQueryParams(params) {
    var conditionArr = params.match(/\(([^\)]*)\)/g);

    return conditionArr.map(function (condition) {
        var conditionArr = (0, _lodash2.default)(condition, '()');

        conditionArr = conditionArr.match(/([a-z]*)([ :><=]*)([a-z0-9]*)/i);
        conditionArr.shift();

        conditionArr = conditionArr.map(_lodash2.default);

        return conditionArr;
    });
}