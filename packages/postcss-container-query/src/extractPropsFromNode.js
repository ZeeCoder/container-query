import camelCase from "lodash.camelcase";
import isValueUsingContainerUnits from "./isValueUsingContainerUnits";
import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    MIN_UNIT,
    MAX_UNIT
} from "../../common/src/constants";
import isEmptyObject from "./isEmptyObject";

/**
 * Creates a styles object from the css declarations found in the given rule
 * node.
 *
 * @param {Node} ruleNode
 * @param {{
 *  isContainer: boolean,
 *  onlyContainerUnits: boolean,
 *  stripContainerUnits: boolean,
 * }} opts
 * @todo clean up docs
 * @param {boolean} [isContainer] If the current node is a container, then the
 * usage of container units with the with and height props will be limited, and
 * may throw
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
export default function extractPropsFromNode(
    ruleNode,
    opts = {
        isContainer: false,
        onlyContainerUnits: false,
        stripContainerUnits: false
    }
) {
    if (ruleNode.type !== "rule") {
        throw new Error('`ruleNode` must be of type "rule".');
    }

    if (Array.isArray(ruleNode.nodes) === false) {
        return {};
    }

    const response = {
        styles: {},
        values: {}
    };
    const nodesLength = ruleNode.nodes.length;

    for (let i = 0; i < nodesLength; i++) {
        let node = ruleNode.nodes[i];
        if (typeof node === "undefined") {
            continue;
        }

        const containerUnitsUsed = isValueUsingContainerUnits(node.value);

        if (
            node.type !== "decl" ||
            (opts.onlyContainerUnits && !containerUnitsUsed)
        ) {
            continue;
        }

        if (opts.isContainer && containerUnitsUsed) {
            if (
                (node.prop === "width" || node.prop === "height") &&
                (node.value.indexOf(MIN_UNIT) !== -1 ||
                    node.value.indexOf(MAX_UNIT) !== -1)
            ) {
                throw node.error(
                    `Width and height properties on containers cannot use ${MIN_UNIT} or ${MAX_UNIT} units.`
                );
            }

            if (
                node.prop === "width" &&
                node.value.indexOf(WIDTH_UNIT) !== -1
            ) {
                throw node.error(
                    `Containers cannot use ${WIDTH_UNIT} for the width property.`
                );
            }

            if (
                node.prop === "height" &&
                node.value.indexOf(HEIGHT_UNIT) !== -1
            ) {
                throw node.error(
                    `Containers cannot use ${HEIGHT_UNIT} for the height property.`
                );
            }
        }

        if (containerUnitsUsed) {
            response.values[camelCase(node.prop)] = node.value;
        } else {
            response.styles[camelCase(node.prop)] = node.value;
        }

        if (opts.stripContainerUnits && containerUnitsUsed) {
            ruleNode.nodes.splice(i, 1);
            i--;
        }
    }

    if (isEmptyObject(response.styles)) {
        delete response.styles;
    }

    if (isEmptyObject(response.values)) {
        delete response.values;
    }

    return response;
}
