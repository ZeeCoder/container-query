// @flow
import objectAssign from "object-assign";
import getConditionFunction from "./getConditionFunction";
import type { Meta } from "../flow/types";

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 */
export default function processMeta(meta: Meta): Meta {
  // Validate configuration before processing
  if (
    typeof meta !== "object" ||
    typeof meta.selector !== "string" ||
    !Array.isArray(meta.queries)
  ) {
    throw new Error(
      "Invalid meta object. It's either not an object, or it's missing the 'selectors' and/or the 'queries' property."
    );
  }

  // Configuration seems valid, process it
  // TODO make a deep copy
  const processedMeta = objectAssign({}, meta);

  processedMeta.queries.forEach(queryData => {
    queryData.conditionFunction = getConditionFunction(queryData.conditions);
  });

  return processedMeta;
}
