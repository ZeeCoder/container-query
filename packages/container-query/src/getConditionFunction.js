// @flow
import type { ContainerSize } from "../flow/types";

/**
 * Combines condition functions into a single "and" one.
 */
function andCondition(
  conditionFunctions: Function[],
  containerSize: ContainerSize
): boolean {
  let conditionFunctionsLength = conditionFunctions.length;
  for (let i = 0; i < conditionFunctionsLength; i++) {
    if (!conditionFunctions[i](containerSize)) {
      return false;
    }
  }

  return true;
}

/**
 * Combines condition functions into a single "or" one.
 */
function orCondition(
  conditionFunctions: Function[],
  containerSize: ContainerSize
): boolean {
  let conditionFunctionsLength = conditionFunctions.length;
  for (let i = 0; i < conditionFunctionsLength; i++) {
    if (conditionFunctions[i](containerSize)) {
      return true;
    }
  }

  return false;
}

function noCondition(): boolean {
  return true;
}

/**
 * Converts a condition array to a function like so:
 * `[ "orientation", ":", "portrait" ]` => Function
 */
function convertConditionArrayToFunction(
  condition: [string, string, number | string]
): Function {
  const feature = condition[0];
  const operation = condition[1];
  let value = condition[2];

  if (feature === "width") {
    if (operation === ">") {
      return containerSize => {
        return containerSize.width > parseInt(value);
      };
    } else if (operation === ">=") {
      return containerSize => {
        return containerSize.width >= parseInt(value);
      };
    } else if (operation === "<") {
      return containerSize => {
        return containerSize.width < parseInt(value);
      };
    } else if (operation === "<=") {
      return containerSize => {
        return containerSize.width <= parseInt(value);
      };
    }
  } else if (feature === "height") {
    if (operation === ">") {
      return containerSize => {
        return containerSize.height > parseInt(value);
      };
    } else if (operation === ">=") {
      return containerSize => {
        return containerSize.height >= parseInt(value);
      };
    } else if (operation === "<") {
      return containerSize => {
        return containerSize.height < parseInt(value);
      };
    } else if (operation === "<=") {
      return containerSize => {
        return containerSize.height <= parseInt(value);
      };
    }
  } else if (feature === "aspect-ratio") {
    if (operation === ">") {
      return containerSize => {
        return containerSize.width / containerSize.height > parseFloat(value);
      };
    } else if (operation === ">=") {
      return containerSize => {
        return containerSize.width / containerSize.height >= parseFloat(value);
      };
    } else if (operation === "<") {
      return containerSize => {
        return containerSize.width / containerSize.height < parseFloat(value);
      };
    } else if (operation === "<=") {
      return containerSize => {
        return containerSize.width / containerSize.height <= parseFloat(value);
      };
    }
  } else if (feature === "orientation") {
    if (value === "portrait") {
      return containerSize => {
        return containerSize.height >= containerSize.width;
      };
    } else {
      return containerSize => {
        return containerSize.height < containerSize.width;
      };
    }
  }

  // If the condition was unsupported
  return noCondition;
}

/**
 * Converts an array of condition arrays to a function, that accepts a container
 * dimension object with `with` and `height` props.
 *
 * `conditions`: An array of conditions represented by a multidimensional array
 * where "(width > 100) and (height > 100), (orientation: landscape)"
 * is expected to be:
 * [
 *   [
 *     [ "width", ">", 100 ],
 *     [ "height", ">", 100 ],
 *   ],
 *   [
 *     [ "orientation", ":", "landscape" ]
 *   ]
 * ]
 */
export default function getConditionFunction(conditions: []): Function {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return noCondition;
  }

  return orCondition.bind(
    this,
    conditions.map(andConditions => {
      return andCondition.bind(
        this,
        andConditions.map(convertConditionArrayToFunction)
      );
    })
  );
}
