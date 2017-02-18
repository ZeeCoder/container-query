import camelCase from 'lodash.camelcase';
import isValueUsingContainerUnits from './isValueUsingContainerUnits';
import detectContainerDefinition from './detectContainerDefinition';

/**
 * Creates a styles object from the css declarations found in the given rule
 * node.
 *
 * @param {Node} ruleNode
 * @param {bool} [onlyContainerUnits]
 *
 * @throws Error if the ruleNode is not actually a rule
 * @throws Error if onlyContainerUnits is true, and ruleNode is a container
 * where container units were found to be used with either the `width` or
 * `height` properties.
 *
 * @returns {Object}
 */
export default function getStylesObjectFromNode(
    ruleNode,
    onlyContainerUnits = false
) {
    if (ruleNode.type !== 'rule') {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    const styles = {};
    const isContainer = detectContainerDefinition(ruleNode) !== null;

    if (Array.isArray(ruleNode.nodes)) {
        ruleNode.nodes.forEach((/** Node */ node) => {
            if (
                node.type !== 'decl' ||
                (
                    onlyContainerUnits &&
                    !isValueUsingContainerUnits(node.value)
                )
            ) {
                return;
            }

            if (
                onlyContainerUnits &&
                isContainer &&
                [ 'width', 'height' ].indexOf(node.prop) !== -1
            ) {
                // @todo more helpful message here
                throw new Error('A container cannot use container units for its width and/or height properties.');
            }

            styles[camelCase(node.prop)] = node.value;
        });
    }

    return styles;
}
