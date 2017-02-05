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

    console.log('=== Adjusting');
    console.log($container[0]);
    console.log(config);
    console.log(containerDimensions);

    config.values.forEach((currentValue) => {
        if (typeof currentValue.conditions !== 'undefined') {
            return;
        }

        currentValue.elements.forEach((elementData) => {
            let adjustedValues = adjustValuesByContainerDimensions(containerDimensions, elementData.values);

            $container.find(elementData.selector).css(adjustedValues);
        });
    });
}
