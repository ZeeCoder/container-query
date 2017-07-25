import postcss from "postcss";
import containerQuery from "./containerQuery";
import Root from "../__mocks__/Root";
import Node from "../__mocks__/Node";
import RuleNode from "../__mocks__/RuleNode";
jest.mock("./saveJSON");

test("should use the default json saving function if none was supplied", () => {
  const saveJSON = require("./saveJSON").default;

  const pluginInstance = containerQuery();

  pluginInstance(new Root());

  expect(saveJSON).toHaveBeenCalledTimes(1);
});

test("missing container declaration", () => {
  const pluginInstance = containerQuery();

  expect(() => {
    pluginInstance(new Root().addContainerQuery("(orientation: landscape)"));
  }).toThrowError(
    `Missing @define-container declaration before the processed node.`
  );
});

test("missing container declaration when the container has r-units", () => {
  const pluginInstance = containerQuery({
    singleContainer: false
  });

  expect(() => {
    pluginInstance(
      new Root().addNode(
        new RuleNode(".Container").addDeclaration("line-height", `2rh`)
      )
    );
  }).toThrowError(
    `Missing @define-container declaration before the processed node.`
  );
});

test("should ignore unrecognised at-rules, like @keyframes", done => {
  const pluginInstance = containerQuery({
    singleContainer: false,
    getJSON: (path, json) => {
      expect(json).toEqual({
        ".Container": {
          selector: ".Container",
          queries: [
            {
              elements: [
                {
                  selector: ".Container",
                  values: {
                    "line-height": `3rh`,
                    "font-size": `1rh`,
                    "margin-left": `2rw`
                  }
                },
                {
                  selector: ".Container__element",
                  values: {
                    "font-size": `1rw`,
                    "line-height": `2rw`
                  }
                }
              ]
            },
            {
              conditions: [[["orientation", ":", "landscape"]]],
              elements: [
                {
                  selector: ".Container",
                  styles: { "font-size": "24px" }
                }
              ]
            }
          ]
        }
      });
      done();
    }
  });

  pluginInstance(
    new Root()
      .addNode(
        new RuleNode(".unrelated-class").addDeclaration("color", "black")
      )
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `2rh`)
          .addContainerDefinition()
          .addDeclaration("border", "none")
      )
      .addNode(
        // This should be noticed, and processed as expected
        new RuleNode(".Container").addDeclaration("font-size", `1rh`)
      )
      .addNode(
        new Node({
          type: "atrule",
          name: "keyframes",
          params: "Expand"
        })
          .addNode(new RuleNode("0%").addDeclaration("opacity", "0%"))
          .addNode(new RuleNode("100%").addDeclaration("opacity", "1000%"))
      )
      .addNode(
        new Node({
          type: "atrule",
          name: "container",
          params: "(orientation: landscape)"
        }).addNode(
          new RuleNode(".Container").addDeclaration("font-size", "24px")
        )
      )
      // Should ignore empty container query
      .addNode(
        new Node({
          type: "atrule",
          name: "container",
          params: "(orientation: portrait)"
        }).addNode(new RuleNode(".Container"))
      )
      // should process container values even after container queries
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `3rh`)
          .addDeclaration("margin-left", `2rw`)
      )
      // should process default elements using values
      .addNode(
        new RuleNode(".Container__element").addDeclaration("font-size", `1rw`)
      )
      // This should be overriden by the following node
      .addNode(
        new RuleNode(".Container__element").addDeclaration("line-height", `1rw`)
      )
      .addNode(
        new RuleNode(".Container__element").addDeclaration("line-height", `2rw`)
      )
  );
});

test("proper json and css output", () => {
  let containersJSON = null;

  return postcss([
    containerQuery({
      singleContainer: false,
      getJSON: (cssPath, json) => (containersJSON = json)
    })
  ])
    .process(
      `
                .Container {
                    @define-container;
                    border: none;
                    font-size: 50rh;
                    /* Ignore this */
                    line-height: 100rh;
                }

                @container (height >= 100px) and (width >= 100px) {
                    .Container {
                        font-size: 70rh;
                    }
                }

                @container (height >= 100px) {
                    .Container {
                        background: none;
                    }
                    /* Ignore this */
                }

                @container (height >= 100px) and (width >= 100px), (aspect-ratio > 3.5) {
                    .Container {
                        background: #000;
                    }
                }

                /* Ignore this */

                .Container2 {
                    @define-container
                    font-size: 10px;
                    border: 1px solid;
                }

                .Container2__element {
                    width: 50rw;
                    height: 50rh;
                    background: green;
                }

                @container (orientation: portrait) {
                    .Container2 {
                        font-size: 70rh;
                    }

                    .Container2__element {
                        width: 75rw;
                        height: 75rh;
                        background: red;
                    }
                }
            `,
      { from: "src/app.css", to: "dest/app.css" }
    )
    .then(result => {
      expect(result.css).toEqual(
        `
                .Container {
                    border: none;
                    /* Ignore this */
                }

                /* Ignore this */

                .Container2 {
                    border: 1px solid;
                }

                .Container2__element {
                    background: green;
                }
            `
      );

      expect(typeof containersJSON[".Container"]).toBe("object");
      expect(containersJSON[".Container"]).toEqual({
        selector: ".Container",
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  "font-size": `50rh`,
                  "line-height": `100rh`
                }
              }
            ]
          },
          {
            conditions: [[["height", ">=", 100], ["width", ">=", 100]]],
            elements: [
              {
                selector: ".Container",
                values: {
                  "font-size": `70rh`
                }
              }
            ]
          },
          {
            conditions: [[["height", ">=", 100]]],
            elements: [
              {
                selector: ".Container",
                styles: {
                  background: "none"
                }
              }
            ]
          },
          {
            conditions: [
              [["height", ">=", 100], ["width", ">=", 100]],
              [["aspect-ratio", ">", 3.5]]
            ],
            elements: [
              {
                selector: ".Container",
                styles: {
                  background: "#000"
                }
              }
            ]
          }
        ]
      });

      expect(typeof containersJSON[".Container2"]).toBe("object");
      expect(containersJSON[".Container2"]).toEqual({
        selector: ".Container2",
        queries: [
          {
            elements: [
              {
                selector: ".Container2__element",
                values: {
                  width: `50rw`,
                  height: `50rh`
                }
              }
            ]
          },
          {
            conditions: [[["orientation", ":", "portrait"]]],
            elements: [
              {
                selector: ".Container2",
                values: {
                  "font-size": `70rh`
                }
              },
              {
                selector: ".Container2__element",
                styles: {
                  background: "red"
                },
                values: {
                  width: `75rw`,
                  height: `75rh`
                }
              }
            ]
          }
        ]
      });
    });
});

// This also tests that containers are processed even without queries
test("should auto-detect the container by default", done => {
  const pluginInstance = containerQuery({
    getJSON: (path, json) => {
      expect(json).toEqual({
        selector: ".Container",
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  "line-height": `3rh`,
                  "font-size": `2rh`
                }
              }
            ]
          }
        ]
      });
      done();
    }
  });

  pluginInstance(
    new Root()
      .addNode(
        new RuleNode(".Container")
          .addDeclaration("line-height", `3rh`)
          .addDeclaration("border", "none")
      )
      .addNode(
        new RuleNode(".Container")
          .addContainerDefinition()
          .addDeclaration("font-size", `2rh`)
      )
  );
});

test("should throw in non singleContainer mode for defining a different container", () => {
  const pluginInstance = containerQuery();

  expect(() => {
    pluginInstance(
      new Root()
        .addNode(
          new RuleNode(".Container")
            .addDeclaration("line-height", `3rh`)
            .addDeclaration("border", "none")
        )
        .addNode(
          new RuleNode(".AnotherContainer")
            .addContainerDefinition()
            .addDeclaration("font-size", `2rh`)
        )
    );
  }).toThrow(
    `define-container declaration detected in singleContainer mode. Tried to override ".Container" with ".AnotherContainer".`
  );
});

test("should extract css custom properties", done => {
  const pluginInstance = containerQuery({
    getJSON: (path, json) => {
      expect(json).toEqual({
        selector: ".Container",
        queries: [
          {
            elements: [
              {
                selector: ".Container",
                values: {
                  "--rw": `1rw`,
                  "--rh": `1rh`,
                  "--rmin": `1rmin`,
                  "--rmax": `1rmax`
                }
              }
            ]
          }
        ]
      });
      done();
    }
  });

  pluginInstance(
    new Root().addNode(
      new RuleNode(".Container")
        .addDeclaration("--rw", `1rw`)
        .addDeclaration("--rh", `1rh`)
        .addDeclaration("--rmin", `1rmin`)
        .addDeclaration("--rmax", `1rmax`)
    )
  );
});
