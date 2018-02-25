import _ from "lodash";

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
      stat.conditions = this.current.conditions;
      this.current.conditions = [];
    }

    if (this.current.selector) {
      elementStat.selector = this.current.selector;
      this.current.selector = null;
    }

    if (!_.isEmpty(this.current.styles)) {
      elementStat.styles = this.current.styles;
      this.current.styles = {};
    }
    if (!_.isEmpty(this.current.values)) {
      elementStat.values = this.current.values;
      this.current.values = {};
    }

    stat.elements = [elementStat];

    this.stats.push(stat);

    return this;
  }

  addStyle(decl) {
    // todo better splitting
    const parts = decl.split(":").map(part => _.trim(part));
    if (parts[1].indexOf("rh") !== -1) {
      this.current.values[parts[0]] = parts[1];
    } else {
      this.current.styles[parts[0]] = parts[1];
    }

    return this;
  }

  addQuery(condition) {
    this.flush();

    // todo better splitting
    const parts = condition.split(" ");
    this.current.conditions.push(parts);

    return this;
  }

  addDescendant(selector) {
    // todo validate selector
    this.flush();

    this.current.selector = selector;

    return this;
  }

  optimise() {}

  build() {
    this.flush();

    return this.stats;
  }
}
