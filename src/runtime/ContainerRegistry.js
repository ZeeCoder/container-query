const registry = [];

/**
 * Returns a previously registered Container instance.
 *
 * @param {Element} element
 *
 * @return {Container}
 */
export function getContainerByElement(element) {
    const containerCount = registry.length;
    for (let i = 0; i < containerCount; i++) {
        if (registry[i].element === element) {
            return registry[i].container;
        }
    }

    return null;
}

/**
 * Returns true, if the element was successfully added, false if the element was
 * registered already.
 *
 * @param {Element} element
 * @param {Container} container
 *
 * @return {boolean}
 */
export function addContainerToRegistry(element, container) {
    if (getContainerByElement(element) !== null) {
        return false;
    }

    registry.push({ element, container });

    return true;
}
