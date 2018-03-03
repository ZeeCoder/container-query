import _ from "lodash";
import isValueUsingContainerUnits from "./isValueUsingContainerUnits";
import getConditionsFromQueryParams from "./getConditionsFromQueryParams";

export const CONDITIONS = "a";
export const ELEMENTS = "b";
export const VALUES = "c";
export const STYLES = "d";
export const SELECTOR = "e";

export default class StatsBuilder {
  constructor() {
    this.stats = [];
    this.current = {
      conditions: [],
      selector: null,
      styles: {},
      values: {}
    };
  }

  flush() {
    if (_.isEmpty(this.current.styles) && _.isEmpty(this.current.values)) {
      // nothing to flush
      return;
    }

    const elementStat = {};
    const stat = {};

    if (!_.isEmpty(this.current.conditions)) {
      stat[CONDITIONS] = this.current.conditions;
    }

    if (this.current.selector) {
      elementStat[SELECTOR] = this.current.selector;
    }

    if (!_.isEmpty(this.current.styles)) {
      elementStat[STYLES] = this.current.styles;
      this.current.styles = {};
    }
    if (!_.isEmpty(this.current.values)) {
      elementStat[VALUES] = this.current.values;
      this.current.values = {};
    }

    stat[ELEMENTS] = [elementStat];

    this.stats.push(stat);

    return this;
  }

  addStyle(node) {
    const style = [];

    if (typeof node === "string") {
      const matches = node.match(/([^:]+):(.+)/);
      if (!matches) {
        throw new Error(`Invalid CSS declaration format: "${node}"`);
      }

      const parts = matches.map(part => _.trim(part));
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

    if (
      !isValueUsingContainerUnits(style[1]) &&
      _.isEmpty(this.current.conditions)
    ) {
      throw new Error(
        'Styles without container units (e.g. "rw") can only be added with a @container query.'
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

    this.current.conditions = [];

    return this;
  }

  setQuery(conditions) {
    this.flush();

    this.current.conditions.push(getConditionsFromQueryParams(conditions));

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

  optimise() {}

  build() {
    this.flush();

    return this.stats;
  }
}
