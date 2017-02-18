'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getConditionFunction;
/**
 * Combines condition function into a single one.
 *
 * @param {function[]} conditionFunctions
 * @param {ContainerDimensions} containerDimensions
 *
 * @returns {boolean}
 */
function andCondition(conditionFunctions, containerDimensions) {
    var conditionFunctionsLength = conditionFunctions.length;
    for (var i = 0; i < conditionFunctionsLength; i++) {
        if (!conditionFunctions[i](containerDimensions)) {
            return false;
        }
    }

    return true;
}

function noCondition() {
    return true;
}

/**
 * Converts an array of condition arrays to a function, that accepts a container
 * dimension object with `with` and `height` props.
 *
 * @param {Array[]} [conditions] An array of conditions following the:
 * `[ <feature>, <operation>, <value> ]` pattern
 * Examples:
 * [ "orientation", ":", "landscape" ]
 * [ "width", ">=", 10 ]
 *
 * @returns {function}
 */
function getConditionFunction(conditions) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
        return noCondition;
    }

    var conditionFunctions = conditions.map(function (condition) {
        var feature = condition[0];
        var operation = condition[1];
        var value = condition[2];

        if (feature === 'width') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.width > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.width >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.width < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.width <= value;
                };
            }
        } else if (feature === 'height') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.height <= value;
                };
            }
        } else if (feature === 'aspect-ratio') {
            if (operation === '>') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return function (containerDimensions) {
                    return containerDimensions.width / containerDimensions.height <= value;
                };
            }
        } else if (feature === 'orientation') {
            if (value === 'portrait') {
                return function (containerDimensions) {
                    return containerDimensions.height >= containerDimensions.width;
                };
            } else {
                return function (containerDimensions) {
                    return containerDimensions.height < containerDimensions.width;
                };
            }
        }

        // If the condition was unsupported
        return noCondition;
    });

    return andCondition.bind(this, conditionFunctions);
}