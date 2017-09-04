export type Styles = {
  [property: string]: string
};

export type Node = {
  type: string,
  prop: string,
  value: string,
  selector: string,
  error: Function,
  nodes: Node[]
};
