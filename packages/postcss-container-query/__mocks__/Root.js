import Node from "./Node";

export default class Root extends Node {
  constructor() {
    super({
      type: "root",
      source: {
        input: {
          file: "non/existent/file/path.css"
        }
      }
    });
  }
}
