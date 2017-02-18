/**
 * @param {jQuery} $container
 *
 * @return {ContainerDimensions}
 */
export default function getContainerDimensions ($container) {
    return {
        width: $container.width(),
        height: $container.height(),
    };
}
