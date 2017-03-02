import objectAssign from 'object-assign';
import getContainerDimensions from './getContainerDimensions';
import adjustValueObjectByContainerDimensions from './adjustValueObjectByContainerDimensions';
import applyStylesToElements from "./applyStylesToElements";

/**
 * Apply conditional styles to the container and its elements based on the
 * provided configuration, if criterion are met.
 *
 * @param {HTMLElement} container
 * @param {Object} config
 */
export default function adjustContainer (container, config) {
    const containerDimensions = getContainerDimensions(container);
    const queriesLength = config.queries.length;
    const changeSets = {};

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
                changeSets[elementData.selector] = {
                    elements: (
                        elementData.selector === config.selector
                            ? [ container ]
                            : container.querySelectorAll(elementData.selector)
                    ),
                    change: {},
                };
            }

            objectAssign(
                changeSets[elementData.selector].change,
                adjustValueObjectByContainerDimensions(containerDimensions, elementData.styles)
            );
        });
    }

    for (let elementSelector in changeSets) {
        applyStylesToElements(
            changeSets[elementSelector].change,
            changeSets[elementSelector].elements
        );
    }
}
