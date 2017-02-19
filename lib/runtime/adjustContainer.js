'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = adjustContainer;

var _getContainerDimensions = require('./getContainerDimensions');

var _getContainerDimensions2 = _interopRequireDefault(_getContainerDimensions);

var _adjustValueObjectByContainerDimensions = require('./adjustValueObjectByContainerDimensions');

var _adjustValueObjectByContainerDimensions2 = _interopRequireDefault(_adjustValueObjectByContainerDimensions);

var _applyStylesToElements = require('./applyStylesToElements');

var _applyStylesToElements2 = _interopRequireDefault(_applyStylesToElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply conditional styles to the container and its elements if criterion are
 * met.
 *
 * @param {HTMLElement} container
 * @param {Object} config
 */
function adjustContainer(container, config) {
    var containerDimensions = (0, _getContainerDimensions2.default)(container);
    var queriesLength = config.queries.length;
    var changeSets = {};

    var _loop = function _loop(i) {
        // Check if the condition apply, or if it's the first, default query
        if (i !== 0 && typeof config.queries[i].conditionFunction === 'function' && !config.queries[i].conditionFunction(containerDimensions)) {
            return 'continue';
        }

        config.queries[i].elements.forEach(function (elementData) {
            if (i === 0) {
                changeSets[elementData.selector] = {
                    elements: elementData.selector === config.selector ? [container] : container.querySelectorAll(elementData.selector),
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
        (0, _applyStylesToElements2.default)(changeSets[elementSelector].change, changeSets[elementSelector].elements);
    }
}