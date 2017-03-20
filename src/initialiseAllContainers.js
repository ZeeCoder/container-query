import Container from "./runtime/Container";

/**
 * @param {Object} containers
 * @param {boolean} [adjustOnWindowResize]
 */
export default function initialiseAllContainers (
    containers,
    adjustOnWindowResize = true
) {
    const containerInstances = [];

    function adjustAll () {
        containerInstances.forEach((instance) => instance.adjust());
    }

    for (let containerSelector in containers) {
        document.querySelectorAll(containerSelector).forEach((htmlElement) => {
            containerInstances.push(
                new Container(
                    htmlElement,
                    containers[containerSelector]
                )
            );
        });
    }

    if (adjustOnWindowResize) {
        window.addEventListener('resize', adjustAll);
    }

    // Trigger first adjustment
    document.addEventListener('DOMContentLoaded', adjustAll);
}
