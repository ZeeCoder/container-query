function adjustValuesByContainerDimensions (containerDimensions, valueDefinition) {
    let values = Object.assign({}, valueDefinition);

    for (let cssRule in values) {
        values[cssRule] = convertValue(containerDimensions, values[cssRule]);
    }

    return values;
}

function convertValue (containerDimensions, value) {
    if (value[1] === 'ch') {
        return (containerDimensions.height * value[0]) + 'px';
    }

    return (containerDimensions.width * value[0]) + 'px';
}

export default function adjustContainer ($container, config) {
    let containerDimensions = {
        width: $container.width(),
        height: $container.height(),
    };

    let valuesLength = config.values.length;
    let changeSets = {};

    for (var i = 0; i < valuesLength; i++) {
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
                    $element: $container.find(elementData.selector),
                    change: Object.assign({}, elementData.defaultValues),
                };
            }

            Object.assign(
                changeSets[elementData.selector].change,
                adjustValuesByContainerDimensions(containerDimensions, elementData.values)
            );
        });
    }

    for (let key in changeSets) {
        changeSets[key].$element.css(changeSets[key].change);
    }
}
