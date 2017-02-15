function getFunctionFromConditions (conditions) {
    if (!Array.isArray(conditions)) {
        return noCondition;
    }

    let conditionFunctions = conditions.map((condition) => {
        const rule = condition[0];
        const operation = condition[1];
        const value = condition[2];

        if (rule === 'width') {
            if (operation === '>') {
                return (containerDimensions) => {
                    return containerDimensions.width > value;
                };
            } else if (operation === '>=') {
                return (containerDimensions) => {
                    return containerDimensions.width >= value;
                };
            } else if (operation === '<') {
                return (containerDimensions) => {
                    return containerDimensions.width < value;
                };
            } else if (operation === '<=') {
                return (containerDimensions) => {
                    return containerDimensions.width <= value;
                };
            }
        } else if (rule === 'height') {
            if (operation === '>') {
                return (containerDimensions) => {
                    return containerDimensions.height > value;
                };
            } else if (operation === '>=') {
                return (containerDimensions) => {
                    return containerDimensions.height >= value;
                };
            } else if (operation === '<') {
                return (containerDimensions) => {
                    return containerDimensions.height < value;
                };
            } else if (operation === '<=') {
                return (containerDimensions) => {
                    return containerDimensions.height <= value;
                };
            }
        } else if (rule === 'aspect-ratio') {
            if (operation === '>') {
                return (containerDimensions) => {
                    return (containerDimensions.width / containerDimensions.height) > value;
                };
            } else if (operation === '>=') {
                return (containerDimensions) => {
                    return (containerDimensions.width / containerDimensions.height) >= value;
                };
            } else if (operation === '<') {
                return (containerDimensions) => {
                    return (containerDimensions.width / containerDimensions.height) < value;
                };
            } else if (operation === '<=') {
                return (containerDimensions) => {
                    return (containerDimensions.width / containerDimensions.height) <= value;
                };
            }
        } else if (rule === 'orientation') {
            if (value === 'portrait') {
                return (containerDimensions) => {
                    return containerDimensions.height >= containerDimensions.width;
                };
            } else {
                return (containerDimensions) => {
                    return containerDimensions.height < containerDimensions.width;
                };
            }
        }

        return () => {
            console.log("This condition was not processed properly, returning false.", condition);

            return false;
        };
    });

    return andCondition.bind(this, conditionFunctions);
}

function andCondition (conditionFunctions, containerDimensions) {
    let conditionFunctionsLength = conditionFunctions.length;
    for (let i = 0; i < conditionFunctionsLength; i++) {
        if (!conditionFunctions[i](containerDimensions)) {
            return false;
        }
    }

    return true;
}

function noCondition () { return true; }

module.exports = function processConfig ($container, origConfig) {
    let config = Object.assign({}, origConfig);

    config.queries.forEach((queryData) => {
        queryData.conditionFunction = getFunctionFromConditions(queryData.conditions);
    });

    return config;
};
