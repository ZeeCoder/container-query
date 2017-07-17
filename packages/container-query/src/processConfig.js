// @flow
import objectAssign from "object-assign";
import getConditionFunction from "./getConditionFunction";
import type { QueryStats } from "../../common/src/types";

/**
 * Returns an processed copy of the given configuration object.
 * Enhancements:
 * - Condition arrays are converted to functions that accept container dimensions
 */
export default function processConfig(origConfig: QueryStats): QueryStats {
  // Validate configuration before processing
  if (
    typeof origConfig !== "object" ||
    typeof origConfig.selector !== "string" ||
    !Array.isArray(origConfig.queries)
  ) {
    throw new Error("better message needed");
  }

  // Configuration seems valid, process it
  let config = objectAssign({}, origConfig);

  config.queries.forEach(queryData => {
    queryData.conditionFunction = getConditionFunction(queryData.conditions);
  });

  return config;
}
