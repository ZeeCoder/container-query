'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = adjustContainer;

var _getContainerDimensions = require('./getContainerDimensions');

var _getContainerDimensions2 = _interopRequireDefault(_getContainerDimensions);

var _adjustValueObjectByContainerDimensions = require('./adjustValueObjectByContainerDimensions');

var _adjustValueObjectByContainerDimensions2 = _interopRequireDefault(_adjustValueObjectByContainerDimensions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function adjustQueries($container, containerDimensions, config) {
    var queriesLength = config.queries.length;
    var changeSets = {};

    var _loop = function _loop(i) {
        // Check if the condition apply, or if it's the first, default query
        if (i !== 0 && typeof config.queries[i].conditionFunction === 'function' && !config.queries[i].conditionFunction(containerDimensions)) {
            return 'continue';
        }

        config.queries[i].elements.forEach(function (elementData) {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: elementData.selector === config.selector ? $container : $container.find(elementData.selector),
                    change: {}
                };
            }

            Object.assign(changeSets[elementData.selector].change, (0, _adjustValueObjectByContainerDimensions2.default)(containerDimensions, elementData.styles));
        });
    };

    for (var i = 0; i < queriesLength; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
    }

    for (var elementSelector in changeSets) {
        changeSets[elementSelector].$element.css(changeSets[elementSelector].change);
    }
}

function adjustContainer($container, config) {
    var containerDimensions = (0, _getContainerDimensions2.default)($container);

    adjustQueries($container, containerDimensions, config);
}