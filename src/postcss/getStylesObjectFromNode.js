import camelCase from 'lodash.camelcase';
import isValueUsingContainerUnits from './isValueUsingContainerUnits';

const bannedPropsInContainers = [
    'width',
    'height',
    'padding',
    'padding-left',
    'padding-right',
    'padding-top',
    'padding-bottom',
];

/**
 * Creates a styles object from the css declarations found in the given rule
 * node.
 *
 * @param {Node} ruleNode
 * @param {boolean} [isContainer] If the current node is a container, then using
 * container units on width or height properties will throw an exception.
 * @param {boolean} [onlyContainerUnits] If set, then only container units are
 * returned.
 * @param {boolean} [stripContainerUnits] If set, then all declaration nodes
 * using container units will be stripped away.
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
    isContainer = false,
    onlyContainerUnits = false,
    stripContainerUnits = false
) {
    if (ruleNode.type !== 'rule') {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    const styles = {};

    if (Array.isArray(ruleNode.nodes)) {
        const nodesLength = ruleNode.nodes.length;

        for (let i = 0; i < nodesLength; i++) {
            let node = ruleNode.nodes[i];
            if (typeof node === 'undefined') {
                continue;
            }

            const containerUnitsUsed = isValueUsingContainerUnits(node.value);

            if (
                node.type !== 'decl' ||
                ( onlyContainerUnits && !containerUnitsUsed )
            ) {
                continue;
            }

            if (
                isContainer &&
                containerUnitsUsed &&
                bannedPropsInContainers.indexOf(node.prop) !== -1
            ) {
                throw node.error('A container cannot use container units for the following properties: "' + bannedPropsInContainers.join('", "') + '".');
            }

            styles[camelCase(node.prop)] = node.value;

            if (stripContainerUnits && containerUnitsUsed) {
                ruleNode.nodes.splice(i, 1);
                i--;
            }
        }
    }

    return styles;
}
