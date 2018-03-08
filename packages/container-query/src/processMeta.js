// @flow
import objectAssign from "object-assign";
import getConditionFunction from "./getConditionFunction";
import type { Meta } from "../flow/types";
import {
  SELECTOR,
  CONDITIONS,
  QUERIES
} from "@zeecoder/container-query-meta-builder";

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 */
export default function processMeta(meta: Meta): Meta {
  // Validate configuration before processing
  if (
    typeof meta !== "object" ||
    typeof meta[SELECTOR] !== "string" ||
    !Array.isArray(meta[QUERIES])
  ) {
    throw new Error(
      `Invalid meta object. It's either not an object, or it's missing the '${SELECTOR}' and/or the '${QUERIES}' property.`
    );
  }

  // Configuration seems valid, process it
  // TODO make a deep copy
  const processedMeta = objectAssign({}, meta);

  processedMeta[QUERIES].forEach(queryData => {
    queryData.conditionFunction = getConditionFunction(queryData[CONDITIONS]);
  });

  return processedMeta;
}
