'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processConfig;

var _getConditionFunction = require('./getConditionFunction');

var _getConditionFunction2 = _interopRequireDefault(_getConditionFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processConfig($container, origConfig) {
    var config = Object.assign({}, origConfig);

    config.queries.forEach(function (queryData) {
        queryData.conditionFunction = (0, _getConditionFunction2.default)(queryData.conditions);
    });

    return config;
}