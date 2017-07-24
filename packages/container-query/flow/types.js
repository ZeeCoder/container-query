export type ContainerSize = {
  width: number,
  height: number
};

export type Styles = {
  [property: string]: string
};

export type ElementData = {
  selector: string,
  styles: Styles,
  values: Styles
};

export type QueryStats = {
  selector: string,
  queries: Array<{
    conditions: [string, string, string | number],
    conditionFunction: Function,
    elements: Array<{
      selector: string,
      styles: Styles,
      Values: Styles
    }>
  }>
};

export type RegistryData = {
  instance: Object,
  jsonStats: QueryStats,
  queryState: boolean[]
};
