/**
 * Combines condition functions into a single "and" one.
 *
 * @param {function[]} conditionFunctions
 * @param {ContainerDimensions} containerDimensions
 *
 * @returns {boolean}
 */
function andCondition (conditionFunctions, containerDimensions) {
    let conditionFunctionsLength = conditionFunctions.length;
    for (let i = 0; i < conditionFunctionsLength; i++) {
        if (!conditionFunctions[i](containerDimensions)) {
            return false;
        }
    }

    return true;
}

/**
 * Combines condition functions into a single "or" one.
 *
 * @param {function[]} conditionFunctions
 * @param {ContainerDimensions} containerDimensions
 *
 * @returns {boolean}
 */
function orCondition (conditionFunctions, containerDimensions) {
    let conditionFunctionsLength = conditionFunctions.length;
    for (let i = 0; i < conditionFunctionsLength; i++) {
        if (conditionFunctions[i](containerDimensions)) {
            return true;
        }
    }

    return false;
}

function noCondition () { return true; }

/**
 * Converts a condition array to a function like so:
 * `[ "orientation", ":", "portrait" ]` => function
 *
 * @param {string[]} condition
 *
 * @returns {function}
 */
function convertConditionArrayToFunction (condition) {
    const feature = condition[0];
    const operation = condition[1];
    const value = condition[2];

    if (feature === 'width') {
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
    } else if (feature === 'height') {
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
    } else if (feature === 'aspect-ratio') {
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
    } else if (feature === 'orientation') {
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

    // If the condition was unsupported
    return noCondition;
}


/**
 * Converts an array of condition arrays to a function, that accepts a container
 * dimension object with `with` and `height` props.
 *
 * @param {Array[]} [conditions] An array of conditions represented by a
 * multidimensional array where
 * "(width > 100) and (height > 100), (orientation: landscape)"
 * is expected to be:
 * [
 *   [
 *     [ "width", ">", 100 ],
 *     [ "height", ">", 100 ],
 *   ],
 *   [
 *     [ "orientation", ":", "landscape" ]
 *   ]
 * ]
 *
 * @returns {function}
 */
export default function getConditionFunction (conditions) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
        return noCondition;
    }

    return orCondition.bind(this, conditions.map((andConditions) => {
        return andCondition.bind(this, andConditions.map(convertConditionArrayToFunction));
    }));
}
