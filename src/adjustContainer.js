import {
    adjustValueObjectByContainerDimensions,
    getContainerDimensions,
} from '../lib/utils';

function adjustQueries ($container, containerDimensions, config) {
    let queriesLength = config.queries.length;
    let changeSets = {};

    for (let i = 0; i < queriesLength; i++) {
        // Check if the condition apply, or if it's the first, default query
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
                adjustValueObjectByContainerDimensions(containerDimensions, elementData.styles)
            );
        });
    }

    for (let elementSelector in changeSets) {
        changeSets[elementSelector].$element.css(changeSets[elementSelector].change);
    }
}

export default function adjustContainer ($container, config) {
    const containerDimensions = getContainerDimensions($container);

    adjustQueries($container, containerDimensions, config);
}
