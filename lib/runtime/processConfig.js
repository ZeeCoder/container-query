'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processConfig;

var _getConditionFunction = require('./getConditionFunction');

var _getConditionFunction2 = _interopRequireDefault(_getConditionFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 *
 * @param {Object} origConfig
 *
 * @returns {Object}
 */
function processConfig(origConfig) {
    var config = Object.assign({}, origConfig);

    config.queries.forEach(function (queryData) {
        queryData.conditionFunction = (0, _getConditionFunction2.default)(queryData.conditions);
    });

    return config;
}