// @flow
import type { ContainerSize } from "./Container";
import type { Styles, QueryData, ElementData } from "../types";
import registry from "./containerRegistry";
import union from "lodash.union";
import adjustValueObjectByContainerDimensions from "./adjustValueObjectByContainerDimensions";

// Styles to be applied and props to be removed from elements, based on their
// state and json stat
export type StyleChangeSet = {
    [selector: string]: {
        addStyle: Styles,
        removeProps: string[]
    }
};

export default function(element: HTMLElement, size: ContainerSize) {
    const { queryState, jsonStats } = registry.get(element);
    const affectedProps: {
        [selector: string]: string[]
    } = {};
    const styleChangeSet: StyleChangeSet = {};
    const queryLength = jsonStats.queries.length;

    // Initialise styleChangeSet and affectedProps for all elements
    jsonStats.queries.forEach((queryData: QueryData) => {
        queryData.elements.forEach(elementData => {
            if (typeof styleChangeSet[elementData.selector] !== "undefined") {
                return;
            }

            affectedProps[elementData.selector] = [];
            styleChangeSet[elementData.selector] = {
                addStyle: {},
                removeProps: []
            };
        });
    });

    const getAffectedPropsByElementData = (
        elementData: ElementData
    ): string[] => {
        const affectedStyles = {};

        Object.assign(affectedStyles, elementData.styles);
        Object.assign(affectedStyles, elementData.values);

        return Object.keys(affectedStyles);
    };

    const unsetRemovePropsWithAffectedProps = (
        selector: string,
        affectedProps: string[]
    ) => {
        affectedProps.forEach(prop => {
            let index = styleChangeSet[selector].removeProps.indexOf(prop);
            if (index !== -1) {
                styleChangeSet[selector].removeProps.splice(index, 1);
            }
        });
    };

    const applyQueryAffectedProps = (
        selector: string,
        queryAffectedProps: string[]
    ) => {
        affectedProps[selector] = union(
            affectedProps[selector],
            queryAffectedProps
        );
    };

    let queryIndex = 0;
    jsonStats.queries.forEach((queryData: QueryData) => {
        const doesConditionApply = queryData.conditionFunction(size);

        queryData.elements.forEach(elementData => {
            const queryAffectedProps = getAffectedPropsByElementData(
                elementData
            );
            unsetRemovePropsWithAffectedProps(
                elementData.selector,
                queryAffectedProps
            );

            const prevQueryState = queryState[queryIndex];

            if (!prevQueryState && doesConditionApply) {
                // Query was applied just now, add it to the addStyle object
                Object.assign(
                    styleChangeSet[elementData.selector].addStyle,
                    elementData.styles,
                    elementData.values
                );
                applyQueryAffectedProps(
                    elementData.selector,
                    queryAffectedProps
                );
            } else if (prevQueryState && doesConditionApply) {
                // Query was applied previously, and still being applied
                applyQueryAffectedProps(
                    elementData.selector,
                    queryAffectedProps
                );
            } else if (prevQueryState && !doesConditionApply) {
                // A previously applied query no longer applies

                // set up removeProps
                const propsToRemove = queryAffectedProps.filter(prop => {
                    return (
                        affectedProps[elementData.selector].indexOf(prop) === -1
                    );
                });
                styleChangeSet[elementData.selector].removeProps = union(
                    styleChangeSet[elementData.selector].removeProps,
                    propsToRemove
                );

                // @todo add previous query's styles and values
                const propsToReset = {};
                // There might be styles affected by previous queries.
                // Go back to apply the last values.
            }
        });

        // Update the query state
        queryState[queryIndex] = doesConditionApply;

        queryIndex++;
    });

    // Convert r-units
    // @todo only convert the objects we know for sure, that has r-units
    for (let selector in styleChangeSet) {
        styleChangeSet[
            selector
        ].addStyle = adjustValueObjectByContainerDimensions(
            size,
            styleChangeSet[selector].addStyle
        );
    }

    // Proccessing each query should:
    // - Create a local affectedProps object, which contains the properties
    // affected by that query. (Values are always counted, styles only if
    // they were previously applied, or will be applied now.)
    // - Subtract the local affectedProps from the element's removeProps.
    // - process the query to the add /remove sets:
    //   - If the query was not applied before, and will not be applied now, then
    //   no need to do anything. (Don't add the local affectedProps to the global one)
    //   - If the query was not previously applied, then add both styles and
    //   values (evaluated based on the container size) to the addStyle set, and
    //   merge the local affectedProps on top of the global one.
    //   - If the query was applied before, and is still in effect, then don't
    //   change the addStyle object, but merge the local affectedProps to the global one
    //   - If the query was previously applied, but it's not anymore, then remove
    //   elements from the local affectedProps that are covered by the global
    //   affectedProps, and add the remaining set to the removeProps object.

    return styleChangeSet;
}
