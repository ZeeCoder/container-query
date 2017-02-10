import {
    adjustValueObjectByContainerDimensions,
    getContainerDimensions,
} from '../lib/utils';

function adjustQueries ($container, containerDimensions, config) {
    let queriesLength = config.queries.length;
    let changeSets = {};

    for (let i = 0; i < queriesLength; i++) {
        if (
            i !== 0 &&
            typeof config.queries[i].conditionFunction === 'function' &&
            !config.queries[i].conditionFunction(containerDimensions)
        ) {
            continue;
        }

        config.queries[i].elements.forEach((elementData) => {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: (
                        elementData.selector === config.selector
                            ? $container
                            : $container.find(elementData.selector)
                    ),
                    change: {},
                };
            }

            Object.assign(
                changeSets[elementData.selector].change,
                elementData.styles
            );
        });
    }

    for (let key in changeSets) {
        changeSets[key].$element.css(changeSets[key].change);
    }
}

function adjustValues ($container, containerDimensions, config) {
    let valuesLength = config.values.length;
    let changeSets = {};

    for (let i = 0; i < valuesLength; i++) {
        if (
            i !== 0 &&
            typeof config.values[i].conditionFunction === 'function' &&
            !config.values[i].conditionFunction(containerDimensions)
        ) {
            continue;
        }

        config.values[i].elements.forEach((elementData) => {
            if (i === 0) {
                // @todo This is where missing elements could be addressed
                changeSets[elementData.selector] = {
                    $element: (
                        elementData.selector === config.selector
                            ? $container
                            : $container.find(elementData.selector)
                    ),
                    change: Object.assign({}, elementData.defaultValues),
                };
            }

            Object.assign(
                changeSets[elementData.selector].change,
                adjustValueObjectByContainerDimensions(containerDimensions, elementData.values)
            );
        });
    }

    for (let key in changeSets) {
        changeSets[key].$element.css(changeSets[key].change);
    }
}

export default function adjustContainer ($container, config) {
    const containerDimensions = getContainerDimensions($container);

    adjustValues($container, containerDimensions, config);
    adjustQueries($container, containerDimensions, config);
}
