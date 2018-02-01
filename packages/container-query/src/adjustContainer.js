// @flow
import getContainerSize from "./getContainerSize";
import applyStylesToElements from "./applyStylesToElements";
import containerRegistry from "./containerRegistry";
import getChangedStyles from "./getChangedStyles";
import type { ContainerSize } from "../flow/types";

const findContainerDescendants = (
  container: HTMLElement,
  containerSelector: string,
  descendantSelector: string
) => {
  if (
    containerSelector === descendantSelector ||
    descendantSelector === ":self"
  ) {
    return [container];
  }

  return Array.prototype.slice
    .call(container.querySelectorAll(descendantSelector))
    .filter(descendant => !hasDifferentContainerParent(container, descendant));
};

const hasDifferentContainerParent = (
  container: HTMLElement,
  descendant: Element
): boolean => {
  const descendantParent = descendant.parentElement;
  if (!descendantParent || descendantParent === container) {
    return false;
  }

  if (containerRegistry.has(descendantParent)) {
    return true;
  }

  return hasDifferentContainerParent(container, descendantParent);
};

/**
 * Calculates and applies styles based on which queries applied to the element
 * previously.
 */
export default function adjustContainer(
  container: HTMLElement,
  containerSize: ?ContainerSize = null
) {
  const registryData = containerRegistry.get(container);
  if (!registryData) {
    return;
  }

  if (!containerSize) {
    // Get container size ourselves, if not given
    containerSize = getContainerSize(container);
  }

  // Fetching changed styles since the last time we checked.
  // This contains addStyles and removeProps
  const changedStyles = getChangedStyles(container, containerSize);

  for (let descendantSelector in changedStyles) {
    // Skip if no changes were detected
    if (
      !changedStyles[descendantSelector].addStyle &&
      !Array.isArray(changedStyles[descendantSelector].removeProps)
    ) {
      continue;
    }

    // Normalise to a single changeSet that can be applied by applyStylesToElements
    const changeSet = changedStyles[descendantSelector].addStyle || {};
    if (Array.isArray(changedStyles[descendantSelector].removeProps)) {
      changedStyles[descendantSelector].removeProps.forEach(prop => {
        changeSet[prop] = "";
      });
    }

    // What element(s) do we need to add these styles to?
    const containerSelector = registryData.jsonStats.selector;
    const elements = findContainerDescendants(
      container,
      containerSelector,
      descendantSelector
    );

    // Finally, apply the change set to the elements
    applyStylesToElements(changeSet, elements);
  }
}
