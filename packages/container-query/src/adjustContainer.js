// @flow
import getContainerSize from "./getContainerSize";
import applyStylesToElements from "./applyStylesToElements";
import containerRegistry from "./containerRegistry";
import getChangedStyles from "./getChangedStyles";
import type { ContainerSize } from "../flow/types";

/**
 * Calculates and applies styles based on which queries applied to the element
 * previously.
 */
export default function adjustContainer(
  containerElement: HTMLElement,
  containerSize: ?ContainerSize = null
) {
  const registryData = containerRegistry.get(containerElement);

  if (!registryData) {
    return;
  }

  if (!containerSize) {
    // Get container size ourselves, if not given
    containerSize = getContainerSize(containerElement);
  }

  // Fetching changed styles since the last time we checked.
  // This contains addStyles and removeProps
  const changedStyles = getChangedStyles(containerElement, containerSize);

  for (let elementSelector in changedStyles) {
    // Skip if no changes were detected
    if (
      !changedStyles[elementSelector].addStyle &&
      !Array.isArray(changedStyles[elementSelector].removeProps)
    ) {
      continue;
    }

    // Normalise to a single changeSet that can be applied by applyStylesToElements
    const changeSet = changedStyles[elementSelector].addStyle || {};
    if (Array.isArray(changedStyles[elementSelector].removeProps)) {
      changedStyles[elementSelector].removeProps.forEach(prop => {
        changeSet[prop] = "";
      });
    }

    // What element(s) do we need to add these styles to?
    const elements =
      elementSelector === registryData.jsonStats.selector ||
      elementSelector === ":self"
        ? [containerElement]
        : containerElement.querySelectorAll(elementSelector);

    // Finally, apply the change set to the elements
    applyStylesToElements(changeSet, elements);
  }
}
