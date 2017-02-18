import getConditionFunction from './getConditionFunction';

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 *
 * @param {Object} origConfig
 *
 * @returns {Object}
 */
export default function processConfig (origConfig) {
    let config = Object.assign({}, origConfig);

    config.queries.forEach((queryData) => {
        queryData.conditionFunction = getConditionFunction(queryData.conditions);
    });

    return config;
}
