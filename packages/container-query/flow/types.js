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

export type Meta = {
  selector: string,
  queries: Array<{
    conditions: [string, string, string | number],
    conditionFunction: Function,
    elements: Array<ElementData>
  }>
};

export type RegistryData = {
  instance: Object,
  meta: Meta,
  queryState: boolean[]
};
