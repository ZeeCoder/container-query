import camelCase from 'lodash.camelcase';
import isValueUsingContainerUnits from './isValueUsingContainerUnits';
import detectContainerDefinition from './detectContainerDefinition';

/**
 * Creates a styles object that contains only css declarations that use
 * container units.
 *
 * @param {Node} ruleNode
 *
 * @throws Error if ruleNode is a container and container units were found to be
 * used with either `width` or `height` properties.
 * @throws Error if the `ruleNode` is not actually a rule
 *
 * @returns {Object}
 */
export default function extractContainerUnitStylesFromRule (ruleNode) {
    if (ruleNode.type !== 'rule') {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    const styles = {};

    const isContainer = detectContainerDefinition(ruleNode) !== null;

    ruleNode.nodes.forEach((node) => {
        if (
            node.type !== 'decl' ||
            !isValueUsingContainerUnits(node.value)
        ) {
            return;
        }

        if (
            isContainer &&
            [ 'width', 'height' ].indexOf(node.prop) !== -1
        ) {
            // @todo more helpful message here
            throw new Error('A container cannot use container units for its width and/or height properties.');
        }

        styles[camelCase(node.prop)] = node.value;
    });

    return styles;
}
