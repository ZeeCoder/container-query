// @flow
import camelCase from "lodash.camelcase";
import isValueUsingContainerUnits from "./isValueUsingContainerUnits";
import {
  HEIGHT_UNIT,
  WIDTH_UNIT,
  MIN_UNIT,
  MAX_UNIT
} from "../../common/src/constants";
import isEmptyObject from "../../common/src/isEmptyObject";
import type { Styles, Node } from "../../common/src/types";

/**
 * Extracts styles and container units to an object from the given node.
 *
 * `opts` description:
 * - `isContainer` If true, then certain properties container unit usages will
 * trigger errors. (See @throws descriptions)
 * - `onlyContainerUnits` If true, only container units will be extracted
 * - `stripContainerUnits` If true, then all declarations using container units
 * will be removed from the original node
 *
 * @throws Error if the ruleNode's type is not "rule"
 * @throws Error if `isContainer` is true, and either a width or height property
 * used a min or max r-unit.
 * @throws Error if `isContainer` is true and a width property used a width r-unit.
 * @throws Error if `isContainer` is true and a height property used a height r-unit.
 */
export default function extractPropsFromNode(
  ruleNode: Node,
  opts: {
    isContainer?: boolean,
    onlyContainerUnits?: boolean,
    stripContainerUnits?: boolean
  } = {
    isContainer: false,
    onlyContainerUnits: false,
    stripContainerUnits: false
  }
): {
  styles?: Styles,
  values?: Styles
} {
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

  let nodesLength = ruleNode.nodes.length;
  for (let i = 0; i < nodesLength; i++) {
    let node = ruleNode.nodes[i];

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

      if (node.prop === "width" && node.value.indexOf(WIDTH_UNIT) !== -1) {
        throw node.error(
          `Containers cannot use ${WIDTH_UNIT} for the width property.`
        );
      }

      if (node.prop === "height" && node.value.indexOf(HEIGHT_UNIT) !== -1) {
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
      // Removing declaration, and updating the variables for the loop
      ruleNode.nodes.splice(i, 1);
      i--;
      nodesLength--;
    }
  }

  // Getting rid of empty objects
  if (isEmptyObject(response.styles)) {
    delete response.styles;
  }

  if (isEmptyObject(response.values)) {
    delete response.values;
  }

  return response;
}
