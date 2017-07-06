// @flow
import type { ContainerSize } from "./Container";
import type { Styles, QueryData, ElementData } from "../types";
import registry from "./containerRegistry";
import _union from "lodash.union";
import _difference from "lodash.difference";
import adjustValueObjectByContainerDimensions from "./adjustValueObjectByContainerDimensions";

// Styles to be applied and props to be removed from elements, based on their
// state and json stat
export type StyleChangeSet = {
    [selector: string]: {
        addStyle: Styles,
        removeProps: string[]
    }
};

function getAffectedPropsByElementData(elementData: ElementData): string[] {
    const affectedStyles = {};

    Object.assign(affectedStyles, elementData.styles);
    Object.assign(affectedStyles, elementData.values);

    return Object.keys(affectedStyles);
}

export default function(element: HTMLElement, size: ContainerSize) {
    const { queryState, jsonStats } = registry.get(element);
    const styleChangeSet: StyleChangeSet = {};
    const previouslyAppliedProps: {
        [selector: string]: string[]
    } = {};

    const queriesLength = jsonStats.queries.length - 1;
    for (let queryIndex = queriesLength; queryIndex >= 0; queryIndex--) {
        let queryData: QueryData = jsonStats.queries[queryIndex];
        let doesCurrentlyApply = queryData.conditionFunction();
        let didPreviouslyApply = queryState[queryIndex];

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
            let elementAffectedProps = getAffectedPropsByElementData(
                elementData
            );

            if (doesCurrentlyApply && didPreviouslyApply) {
                // Only the values need to be recalculated
                const applicableValueObject = {};
                let applicableValuePropCount = 0;
                for (let prop in elementData.values) {
                    if (
                        elementPreviouslyAppliedProps.indexOf(prop) === -1 ||
                        elementStyleChangeSet.removeProps.indexOf(prop) !== -1
                    ) {
                        // Add value to addStyle if the prop wasn't affected by
                        // previous queries, or even if it was, it was about to
                        // be removed
                        // if (typeof elementStyleChangeSet.addStyle[prop] === 'undefined') {
                        applicableValuePropCount++;
                        applicableValueObject[prop] = elementData.values[prop];

                        let index = elementStyleChangeSet.removeProps.indexOf(
                            prop
                        );
                        if (index !== -1) {
                            elementStyleChangeSet.removeProps.splice(index, 1);
                        }
                    }
                }

                const currentAddStyle = {};

                // See if there's a property which needs to be readded and
                // removed from "removeProps", since this query adds it
                for (let prop in elementData.styles) {
                    let index = elementStyleChangeSet.removeProps.indexOf(prop);
                    if (index !== -1) {
                        elementStyleChangeSet.removeProps.splice(index, 1);
                        currentAddStyle[prop] = elementData.styles[prop];
                    }
                }

                // Merge in value object
                if (applicableValuePropCount > 0) {
                    Object.assign(
                        currentAddStyle,
                        adjustValueObjectByContainerDimensions(
                            size,
                            applicableValueObject
                        )
                    );
                }

                Object.assign(
                    styleChangeSet[elementData.selector].addStyle,
                    currentAddStyle
                );
            } else if (!doesCurrentlyApply && didPreviouslyApply) {
                // Create removeProps object from all affected styles, overshadowed by previously affected props
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
                    }
                }
                for (let prop in elementData.values) {
                    if (elementPreviouslyAppliedProps.indexOf(prop) === -1) {
                        currentAddStyle[prop] = elementData.values[prop];
                    }
                }

                const applicableCurrentAddStyle = adjustValueObjectByContainerDimensions(
                    size,
                    currentAddStyle
                );

                // Removing props now about to be applied from previous removeProps array
                for (let prop in applicableCurrentAddStyle) {
                    let index = styleChangeSet[
                        elementData.selector
                    ].removeProps.indexOf(prop);
                    if (index !== -1) {
                        styleChangeSet[elementData.selector].removeProps.splice(
                            index,
                            1
                        );
                    }
                }

                Object.assign(
                    styleChangeSet[elementData.selector].addStyle,
                    applicableCurrentAddStyle
                );
            }

            previouslyAppliedProps[elementData.selector] = _union(
                previouslyAppliedProps[elementData.selector],
                elementAffectedProps
            );

            // console.log(
            //     "\n",
            //     'addStyle',
            //     JSON.stringify(styleChangeSet[elementData.selector].addStyle) + "\n",
            //     'removeProps',
            //     styleChangeSet[elementData.selector].removeProps.join(', ') + "\n",
            //     `previouslyAppliedProps: ${previouslyAppliedProps[elementData.selector].join(', ')}`
            // );

            // 1) If the query was previously applied, and it's applied again,
            // then get the values, remove any that is overshadowed by a
            // previously applied property, and generate the rest, adding them
            // to the change set. Then, generate the affected props (both values
            // and styles) and add them to the previously applied props.
            // 2) If a query is applied, but was not applied previously, then
            // get the affected props, and remove any that was previously
            // applied already. Then, generate the remaining to the change set.
            // After all, add the affected styles from the whole query to the
            // previously applied props.
            // 3) If a query is not applied, but previously was, then first
            // create the affected set of props, and remove any that's overshadowed.
            // Then, create the removeProps property, and add the affected props
            // list to the previously applied props.
            //
            // Any time we generate an addStyle object, look at the removeProps,
            // and remove any property that's overshadowed by an addStyle
        });
    }

    return styleChangeSet;
}

// export default function(element: HTMLElement, size: ContainerSize) {
//     const { queryState, jsonStats } = registry.get(element);
//     const affectedProps: {
//         [selector: string]: string[]
//     } = {};
//     const styleChangeSet: StyleChangeSet = {};
//     const queryLength = jsonStats.queries.length;
//
//     // Initialise styleChangeSet and affectedProps for all elements
//     jsonStats.queries.forEach((queryData: QueryData) => {
//         queryData.elements.forEach(elementData => {
//             if (typeof styleChangeSet[elementData.selector] !== "undefined") {
//                 return;
//             }
//
//             affectedProps[elementData.selector] = [];
//             styleChangeSet[elementData.selector] = {
//                 addStyle: {},
//                 removeProps: []
//             };
//         });
//     });
//
//     const getAffectedPropsByElementData = (
//         elementData: ElementData
//     ): string[] => {
//         const affectedStyles = {};
//
//         Object.assign(affectedStyles, elementData.styles);
//         Object.assign(affectedStyles, elementData.values);
//
//         return Object.keys(affectedStyles);
//     };
//
//     const unsetRemovePropsWithAffectedProps = (
//         selector: string,
//         affectedProps: string[]
//     ) => {
//         affectedProps.forEach(prop => {
//             let index = styleChangeSet[selector].removeProps.indexOf(prop);
//             if (index !== -1) {
//                 styleChangeSet[selector].removeProps.splice(index, 1);
//             }
//         });
//     };
//
//     const applyQueryAffectedProps = (
//         selector: string,
//         queryAffectedProps: string[]
//     ) => {
//         affectedProps[selector] = union(
//             affectedProps[selector],
//             queryAffectedProps
//         );
//     };
//
//     let queryIndex = 0;
//     jsonStats.queries.forEach((queryData: QueryData) => {
//         const doesConditionApply = queryData.conditionFunction(size);
//
//         queryData.elements.forEach(elementData => {
//             const queryAffectedProps = getAffectedPropsByElementData(
//                 elementData
//             );
//             unsetRemovePropsWithAffectedProps(
//                 elementData.selector,
//                 queryAffectedProps
//             );
//
//             const prevQueryState = queryState[queryIndex];
//
//             if (!prevQueryState && doesConditionApply) {
//                 // Query was applied just now, add it to the addStyle object
//                 Object.assign(
//                     styleChangeSet[elementData.selector].addStyle,
//                     elementData.styles,
//                     elementData.values
//                 );
//                 applyQueryAffectedProps(
//                     elementData.selector,
//                     queryAffectedProps
//                 );
//             } else if (prevQueryState && doesConditionApply) {
//                 // Query was applied previously, and still being applied
//                 applyQueryAffectedProps(
//                     elementData.selector,
//                     queryAffectedProps
//                 );
//             } else if (prevQueryState && !doesConditionApply) {
//                 // A previously applied query no longer applies
//
//                 // set up removeProps
//                 const propsToRemove = queryAffectedProps.filter(prop => {
//                     return (
//                         affectedProps[elementData.selector].indexOf(prop) === -1
//                     );
//                 });
//                 styleChangeSet[elementData.selector].removeProps = union(
//                     styleChangeSet[elementData.selector].removeProps,
//                     propsToRemove
//                 );
//
//                 // @todo add previous query's styles and values
//                 const propsToReset = {};
//                 // There might be styles affected by previous queries.
//                 // Go back to apply the last values.
//             }
//         });
//
//         // Update the query state
//         queryState[queryIndex] = doesConditionApply;
//
//         queryIndex++;
//     });
//
//     // Convert r-units
//     // @todo only convert the objects we know for sure, that has r-units
//     for (let selector in styleChangeSet) {
//         styleChangeSet[
//             selector
//         ].addStyle = adjustValueObjectByContainerDimensions(
//             size,
//             styleChangeSet[selector].addStyle
//         );
//     }
//
//     // Proccessing each query should:
//     // - Create a local affectedProps object, which contains the properties
//     // affected by that query. (Values are always counted, styles only if
//     // they were previously applied, or will be applied now.)
//     // - Subtract the local affectedProps from the element's removeProps.
//     // - process the query to the add /remove sets:
//     //   - If the query was not applied before, and will not be applied now, then
//     //   no need to do anything. (Don't add the local affectedProps to the global one)
//     //   - If the query was not previously applied, then add both styles and
//     //   values (evaluated based on the container size) to the addStyle set, and
//     //   merge the local affectedProps on top of the global one.
//     //   - If the query was applied before, and is still in effect, then don't
//     //   change the addStyle object, but merge the local affectedProps to the global one
//     //   - If the query was previously applied, but it's not anymore, then remove
//     //   elements from the local affectedProps that are covered by the global
//     //   affectedProps, and add the remaining set to the removeProps object.
//
//     return styleChangeSet;
// }
