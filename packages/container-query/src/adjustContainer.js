import objectAssign from "object-assign";
import getContainerDimensions from "./getContainerDimensions";
import adjustValueObjectByContainerDimensions from "./adjustValueObjectByContainerDimensions";
import applyStylesToElements from "./applyStylesToElements";
import containerRegistry from "./containerRegistry";
import isEmptyObject from "./isEmptyObject";

/**
 * Apply conditional styles to the container and its elements based on the
 * provided configuration, if criterion are met.
 *
 * @param {HTMLElement} container
 * @param {Object} [config] Expects a configuration object that was processed
 * (and validated) by `processConfig`
 * @param {ContainerDimensions} [containerSize]
 */
export default function adjustContainer(container, containerSize = null) {
    const registryData = containerRegistry.get(container);

    if (!containerSize) {
        // Get container size ourselves, if not given
        containerSize = getContainerDimensions(container);
    }

    // Fetching changed styles since the last time we checked.
    // This contains addStyles and removeProps
    const changedStyles = getChangedStyles(container, containerSize);

    // Skip if no changes were detected
    // @todo this could be smarter?
    if (
        isEmptyObject(changedStyles.addStyles) &&
        changedStyles.removeProps.length === 0
    ) {
        return;
    }

    for (let elementSelector in changedStyles) {
        // Normalise to a single changeSet that can be applied by applyStylesToElements
        const changeSet = changedStyles[elementSelector].styles;
        changedStyles[elementSelector].values.forEach(prop => {
            changeSet[prop] = "";
        });

        // What element(s) do we need to add these styles to?
        const elements = elementSelector === registryData.jsonStats.selector
            ? [container]
            : container.querySelectorAll(elementSelector);

        // Finally, apply the change set to the elements
        applyStylesToElements(changeSet, elements);
    }
}
