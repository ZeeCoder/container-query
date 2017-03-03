import objectAssign from 'object-assign';
import getConditionFunction from './getConditionFunction';

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 *
 * @param {Object} origConfig
 *
 * @returns {Object|null} Return null for invalid configurations
 */
export default function processConfig (origConfig) {
    // Validate configuration before processing
    if (
        typeof origConfig !== 'object' ||
        typeof origConfig.selector !== 'string' ||
        !Array.isArray(origConfig.queries)
    ) {
        return null;
    }

    // Configuration seems valid, process it
    let config = objectAssign({}, origConfig);

    config.queries.forEach((queryData) => {
        queryData.conditionFunction = getConditionFunction(queryData.conditions);
    });

    return config;
}
