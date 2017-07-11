import getContainerDimensions from "./getContainerDimensions";
import applyStylesToElements from "./applyStylesToElements";
import containerRegistry from "./containerRegistry";
import isEmptyObject from "./isEmptyObject";
import getChangedStyles from "./getChangedStyles";

/**
 * Calculates and applies styles based on which queries applied to the element
 * previously.
 *
 * @param {HTMLElement} containerElement
 * @param {ContainerDimensions} [containerSize]
 */
export default function adjustContainer(
    containerElement,
    containerSize = null
) {
    const registryData = containerRegistry.get(containerElement);

    if (!containerSize) {
        // Get container size ourselves, if not given
        containerSize = getContainerDimensions(containerElement);
    }

    // Fetching changed styles since the last time we checked.
    // This contains addStyles and removeProps
    const changedStyles = getChangedStyles(containerElement, containerSize);

    for (let elementSelector in changedStyles) {
        // Skip if no changes were detected
        // @todo this could be smarter?
        if (
            isEmptyObject(changedStyles[elementSelector].addStyle) &&
            changedStyles[elementSelector].removeProps.length === 0
        ) {
            continue;
        }

        // Normalise to a single changeSet that can be applied by applyStylesToElements
        const changeSet = changedStyles[elementSelector].addStyle;
        changedStyles[elementSelector].removeProps.forEach(prop => {
            changeSet[prop] = "";
        });

        // What element(s) do we need to add these styles to?
        const elements =
            elementSelector === registryData.jsonStats.selector
                ? [containerElement]
                : containerElement.querySelectorAll(elementSelector);

        // Finally, apply the change set to the elements
        applyStylesToElements(changeSet, elements);
    }
}
