// @flow
import type { ContainerSize, Styles, ElementData } from "../flow/types";
import registry from "./containerRegistry";
import _union from "lodash.union";
import _difference from "lodash.difference";
import adjustValueObjectByContainerSize from "./adjustValueObjectByContainerSize";
import objectAssign from "object-assign";

function getAffectedPropsByElementData(elementData: ElementData): string[] {
  const affectedStyles = {};

  objectAssign(affectedStyles, elementData.styles);
  objectAssign(affectedStyles, elementData.values);

  return Object.keys(affectedStyles);
}

export default function getChangedStyles(
  element: HTMLElement,
  size: ContainerSize
): {
  [selector: string]: {
    addStyle?: Styles,
    removeProps?: string[]
  }
} {
  const registryData = registry.get(element);
  if (!registryData) {
    return {};
  }

  const { queryState, jsonStats, instance } = registryData;
  const styleChangeSet = {};
  const previouslyAppliedProps: {
    [selector: string]: string[]
  } = {};

  const queriesLength = jsonStats.queries.length - 1;
  for (let queryIndex = queriesLength; queryIndex >= 0; queryIndex--) {
    let queryData = jsonStats.queries[queryIndex];
    // Default queries have no `conditionFunction`
    let doesCurrentlyApply =
      typeof queryData.conditionFunction === "function"
        ? queryData.conditionFunction(size)
        : true;
    let didPreviouslyApply = queryState[queryIndex];

    queryState[queryIndex] = doesCurrentlyApply;

    queryData.elements.forEach((elementData: ElementData) => {
      if (!styleChangeSet[elementData.selector]) {
        styleChangeSet[elementData.selector] = {
          addStyle: {},
          removeProps: []
        };
      }

      if (!previouslyAppliedProps[elementData.selector]) {
        previouslyAppliedProps[elementData.selector] = [];
      }

      let elementStyleChangeSet = styleChangeSet[elementData.selector];
      let elementPreviouslyAppliedProps =
        previouslyAppliedProps[elementData.selector];

      if (doesCurrentlyApply && didPreviouslyApply) {
        // Only the values need to be recalculated
        const applicableValueObject = {};
        let applicableValuePropCount = 0;
        for (let prop in elementData.values) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            // Add value to addStyle if the prop wasn't affected by
            // previous queries, or even if it was, it was about to
            // be removed
            applicableValuePropCount++;
            applicableValueObject[prop] = elementData.values[prop];

            // Also add the prop as applied unless it was added before
            elementPreviouslyAppliedProps.push(prop);

            let index = elementStyleChangeSet.removeProps.indexOf(prop);
            if (index !== -1) {
              elementStyleChangeSet.removeProps.splice(index, 1);
            }
          }
        }

        const currentAddStyle = {};

        // See if there's a property which needs to be readded and
        // removed from "removeProps", since this query still keeps it
        // in an applied state
        for (let prop in elementData.styles) {
          let index = elementStyleChangeSet.removeProps.indexOf(prop);
          if (index !== -1) {
            elementStyleChangeSet.removeProps.splice(index, 1);
            currentAddStyle[prop] = elementData.styles[prop];
          }

          // Also add the prop as applied unless it was added before
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            elementPreviouslyAppliedProps.push(prop);
          }
        }

        // Merge in value object
        if (applicableValuePropCount > 0) {
          objectAssign(
            currentAddStyle,
            adjustValueObjectByContainerSize(
              size,
              applicableValueObject,
              instance.opts.valuePrecision
            )
          );
        }

        // Adding changes to `addStyle`
        objectAssign(
          styleChangeSet[elementData.selector].addStyle,
          currentAddStyle
        );
      } else if (!doesCurrentlyApply && didPreviouslyApply) {
        let elementAffectedProps = getAffectedPropsByElementData(elementData);

        // Create removeProps object from all affected styles, not touching previously applied props however
        let applicableRemoveProps = _difference(
          elementAffectedProps,
          elementPreviouslyAppliedProps
        );
        styleChangeSet[elementData.selector].removeProps = _union(
          styleChangeSet[elementData.selector].removeProps,
          applicableRemoveProps
        );
      } else if (doesCurrentlyApply && !didPreviouslyApply) {
        // Create new addStyle object, overshadowed by previouslyAppliedProps.
        // Also remove anything in the new addStyle object from the current removeProps
        const currentAddStyle: Styles = {};

        for (let prop in elementData.styles) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            currentAddStyle[prop] = elementData.styles[prop];
            elementPreviouslyAppliedProps.push(prop);
          }
        }
        for (let prop in elementData.values) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            currentAddStyle[prop] = elementData.values[prop];
            elementPreviouslyAppliedProps.push(prop);
          }
        }

        const applicableCurrentAddStyle = adjustValueObjectByContainerSize(
          size,
          currentAddStyle,
          instance.opts.valuePrecision
        );

        // Removing props now about to be applied from previous removeProps array
        for (let prop in applicableCurrentAddStyle) {
          let index = styleChangeSet[elementData.selector].removeProps.indexOf(
            prop
          );
          if (index !== -1) {
            styleChangeSet[elementData.selector].removeProps.splice(index, 1);
          }
        }

        objectAssign(
          styleChangeSet[elementData.selector].addStyle,
          applicableCurrentAddStyle
        );
      }
    });
  }

  // Remove empty objects / arrays
  for (let selector in styleChangeSet) {
    if (Object.keys(styleChangeSet[selector].addStyle).length === 0) {
      delete styleChangeSet[selector].addStyle;
    }

    if (styleChangeSet[selector].removeProps.length === 0) {
      delete styleChangeSet[selector].removeProps;
    }
  }

  return styleChangeSet;
}
