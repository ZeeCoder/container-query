'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processConfig;
function getFunctionFromConditions(conditions) {
    if (!Array.isArray(conditions)) {
        return noCondition;
    }

    var conditionFunctions = conditions.map(function (condition) {
        var rule = condition[0];
        var operation = condition[1];
        var value = condition[2];

        if (rule === 'width') {
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
        } else if (rule === 'height') {
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
        } else if (rule === 'aspect-ratio') {
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
        } else if (rule === 'orientation') {
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

        return function () {
            return false;
        };
    });

    return andCondition.bind(this, conditionFunctions);
}

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

function processConfig($container, origConfig) {
    var config = Object.assign({}, origConfig);

    config.queries.forEach(function (queryData) {
        queryData.conditionFunction = getFunctionFromConditions(queryData.conditions);
    });

    return config;
}