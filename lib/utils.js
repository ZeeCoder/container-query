export const HEIGHT_UNIT = 'ch';
export const WIDTH_UNIT = 'cw';

/**
 * Converts a container value to pixels, based on the current container's
 * dimensions.
 *
 * @param  {{ width: number, height: number }} containerDimensions
 * @param  {[number, string]} value Ex: `[0.6, 'ch']`
 * @return {string} Ex: "123px"
 */
export function convertValueToPixel (containerDimensions, value) {
    if (value[1] === HEIGHT_UNIT) {
        return (containerDimensions.height * value[0]) + 'px';
    }

    return (containerDimensions.width * value[0]) + 'px';
}
