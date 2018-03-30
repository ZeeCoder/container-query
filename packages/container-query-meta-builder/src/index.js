import objectAssign from "object-assign";
import isValueUsingContainerUnits from "./isValueUsingContainerUnits";
import getConditionsFromQueryParams from "./getConditionsFromQueryParams";

export const CONDITIONS = "a";
export const ELEMENTS = "b";
export const VALUES = "c";
export const STYLES = "d";
export const SELECTOR = "e";
export const QUERIES = "f";

// export const CONDITIONS = "conditions";
// export const ELEMENTS = "elements";
// export const VALUES = "values";
// export const STYLES = "styles";
// export const SELECTOR = "selector";
// export const QUERIES = "queries";

const isEmpty = obj => Object.keys(obj).length === 0;

const sameCondition = (cond1, cond2) => {
  if (!Array.isArray(cond1) || !Array.isArray(cond2)) {
    return cond1 === cond2;
  }

  if (cond1.length !== cond2.length) {
    return false;
  }

  cond1 = cond1[0];
  cond2 = cond2[0];

  if (cond1.length !== cond2.length) {
    return false;
  }

  const outerArrLength = cond1.length;
  for (let i = 0; i < outerArrLength; i++) {
    const innerArrLength = cond1[i].length;

    for (let j = 0; j < innerArrLength; j++) {
      if (cond1[i][j] !== cond2[i][j]) {
        return false;
      }
    }
  }

  return true;
};

const getElementData = (queries, conditions = null, selector = null) => {
  const newElementData = {};

  if (selector) {
    newElementData[SELECTOR] = selector;
  }

  const queriesLength = queries.length;
  for (let i = 0; i < queriesLength; i++) {
    const query = queries[i];

    if (
      (!query[CONDITIONS] && !conditions) ||
      sameCondition(query[CONDITIONS], conditions)
    ) {
      const elementsLength = query[ELEMENTS].length;
      for (let j = 0; j < elementsLength; j++) {
        const elementData = query[ELEMENTS][j];
        if (
          (!elementData[SELECTOR] && !selector) ||
          elementData[SELECTOR] === selector
        ) {
          return elementData;
        }
      }

      // no element data was found with this selector, so add one
      query[ELEMENTS].push(newElementData);

      return newElementData;
    }
  }

  const query = { [ELEMENTS]: [] };

  if (conditions) {
    query[CONDITIONS] = conditions;
  }

  query[ELEMENTS].push(newElementData);
  queries.push(query);

  return newElementData;
};

export default class MetaBuilder {
  constructor(selector) {
    this.selector = selector;
    this.queries = [];
    this.current = {
      conditions: null,
      selector: null,
      styles: {},
      values: {}
    };
  }

  flush() {
    if (isEmpty(this.current.styles) && isEmpty(this.current.values)) {
      // nothing to flush
      return;
    }

    const storedElementData = getElementData(
      this.queries,
      this.current.conditions,
      this.current.selector
    );

    // Merge new styles to the stored element data
    if (!isEmpty(this.current.styles)) {
      if (!storedElementData[STYLES]) {
        storedElementData[STYLES] = {};
      }

      objectAssign(storedElementData[STYLES], this.current.styles);
    }

    if (!isEmpty(this.current.values)) {
      if (!storedElementData[VALUES]) {
        storedElementData[VALUES] = {};
      }

      objectAssign(storedElementData[VALUES], this.current.values);
    }

    this.current.styles = {};
    this.current.values = {};

    return this;
  }

  addStyle(node) {
    const style = [];

    if (typeof node === "string") {
      const parts = node.match(/ *([^:]+): *(.+)/);
      if (!parts) {
        throw new Error(`Invalid CSS declaration format: "${node}"`);
      }

      style.push(parts[1], parts[2]);
    } else if (
      typeof node === "object" &&
      node !== null &&
      node.prop &&
      node.value
    ) {
      style.push(node.prop, node.value);
    } else {
      throw new Error(`Unrecognised style: ${node}`);
    }

    if (!isValueUsingContainerUnits(style[1]) && !this.current.conditions) {
      const decl = `${style[0]}: ${style[1]}`;
      throw new Error(
        `Styles without container units (e.g. "rw") can only be added with a @container query. Tried to add: "${decl}"`
      );
    }

    if (isValueUsingContainerUnits(style[1])) {
      this.current.values[style[0]] = style[1];
    } else {
      this.current.styles[style[0]] = style[1];
    }

    return this;
  }

  resetQuery() {
    this.flush();

    this.current.conditions = null;

    return this;
  }

  setQuery(conditions) {
    this.flush();

    this.current.conditions = getConditionsFromQueryParams(conditions);

    return this;
  }

  setDescendant(selector) {
    this.flush();

    this.current.selector = selector;

    return this;
  }

  resetDescendant() {
    this.flush();

    this.current.selector = null;

    return this;
  }

  build() {
    this.flush();

    return {
      [SELECTOR]: this.selector,
      [QUERIES]: this.queries
    };
  }
}
