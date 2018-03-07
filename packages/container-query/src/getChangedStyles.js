// @flow
import type { ContainerSize, Styles, ElementData } from "../flow/types";
import registry from "./containerRegistry";
import _ from "lodash";
import adjustValueObjectByContainerSize from "./adjustValueObjectByContainerSize";
import objectAssign from "object-assign";
import {
  SELECTOR,
  STYLES,
  VALUES,
  QUERIES,
  ELEMENTS
} from "@zeecoder/container-query-meta-builder";

function getAffectedPropsByElementData(elementData: ElementData): string[] {
  const affectedStyles = {};

  objectAssign(affectedStyles, elementData[STYLES]);
  objectAssign(affectedStyles, elementData[VALUES]);

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

  const { queryState, meta, instance } = registryData;
  const styleChangeSet = {};
  const previouslyAppliedProps: {
    [selector: string]: string[]
  } = {};

  const queriesLength = meta[QUERIES].length - 1;
  for (let queryIndex = queriesLength; queryIndex >= 0; queryIndex--) {
    const queryData = meta[QUERIES][queryIndex];
    // Default queries have no `conditionFunction`
    const doesCurrentlyApply =
      typeof queryData.conditionFunction === "function"
        ? queryData.conditionFunction(size)
        : true;
    const didPreviouslyApply = queryState[queryIndex];

    queryState[queryIndex] = doesCurrentlyApply;

    queryData[ELEMENTS].forEach((elementData: ElementData) => {
      // No selector refers to the container
      const selector = elementData[SELECTOR] || ":self";

      if (!styleChangeSet[selector]) {
        styleChangeSet[selector] = {
          addStyle: {},
          removeProps: []
        };
      }

      if (!previouslyAppliedProps[selector]) {
        previouslyAppliedProps[selector] = [];
      }

      const elementStyleChangeSet = styleChangeSet[selector];
      const elementPreviouslyAppliedProps = previouslyAppliedProps[selector];

      if (doesCurrentlyApply && didPreviouslyApply) {
        // Only the values need to be recalculated
        const applicableValueObject = {};
        let applicableValuePropCount = 0;
        for (let prop in elementData[VALUES]) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            // Add value to addStyle if the prop wasn't affected by
            // previous queries, or even if it was, it was about to
            // be removed
            applicableValuePropCount++;
            applicableValueObject[prop] = elementData[VALUES][prop];

            // Also add the prop as applied unless it was added before
            elementPreviouslyAppliedProps.push(prop);

            const index = elementStyleChangeSet.removeProps.indexOf(prop);
            if (index !== -1) {
              elementStyleChangeSet.removeProps.splice(index, 1);
            }
          }
        }

        const currentAddStyle = {};

        // See if there's a property which needs to be readded and
        // removed from "removeProps", since this query still keeps it
        // in an applied state
        for (let prop in elementData[STYLES]) {
          const index = elementStyleChangeSet.removeProps.indexOf(prop);
          if (index !== -1) {
            elementStyleChangeSet.removeProps.splice(index, 1);
            currentAddStyle[prop] = elementData[STYLES][prop];
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
        objectAssign(styleChangeSet[selector].addStyle, currentAddStyle);
      } else if (!doesCurrentlyApply && didPreviouslyApply) {
        const elementAffectedProps = getAffectedPropsByElementData(elementData);

        // Create removeProps object from all affected styles, not touching previously applied props however
        const applicableRemoveProps = _.difference(
          elementAffectedProps,
          elementPreviouslyAppliedProps
        );
        styleChangeSet[selector].removeProps = _.union(
          styleChangeSet[selector].removeProps,
          applicableRemoveProps
        );
      } else if (doesCurrentlyApply && !didPreviouslyApply) {
        // Create new addStyle object, overshadowed by previouslyAppliedProps.
        // Also remove anything in the new addStyle object from the current removeProps
        const currentAddStyle: Styles = {};

        for (let prop in elementData[STYLES]) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            currentAddStyle[prop] = elementData[STYLES][prop];
            elementPreviouslyAppliedProps.push(prop);
          }
        }
        for (let prop in elementData[VALUES]) {
          if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
            currentAddStyle[prop] = elementData[VALUES][prop];
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
          const index = styleChangeSet[selector].removeProps.indexOf(prop);

          if (index !== -1) {
            styleChangeSet[selector].removeProps.splice(index, 1);
          }
        }

        objectAssign(
          styleChangeSet[selector].addStyle,
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
