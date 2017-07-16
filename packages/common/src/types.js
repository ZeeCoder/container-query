// @flow
export type Styles = {
  [property: string]: string
};

export type ElementData = {
  selector: string,
  styles: Styles,
  values: Styles
};

export type QueryData = {
  conditionFunction: Function,
  elements: Array<ElementData>
};

export type ContainerSize = {
  width: number,
  height: number
};

export type Node = {
  type: string,
  prop: string,
  value: string,
  selector: string,
  error: Function,
  nodes: Node[]
};
