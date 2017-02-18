import getConditionFunction from './getConditionFunction';

export default function processConfig ($container, origConfig) {
    let config = Object.assign({}, origConfig);

    config.queries.forEach((queryData) => {
        queryData.conditionFunction = getConditionFunction(queryData.conditions);
    });

    return config;
}
