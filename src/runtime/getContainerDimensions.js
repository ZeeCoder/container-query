/**
 * @param {HTMLElement} container
 *
 * @return {ContainerDimensions}
 */
export default function getContainerDimensions (container) {
    return {
        width: container.clientWidth,
        height: container.clientHeight,
    };
}
