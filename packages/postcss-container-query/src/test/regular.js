export const cssInput = `
.Container {
    @define-container;
    border: none;
    font-size: 50rh;
    /* Ignore this comment */
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
    /* Ignore this comment */
}

@container (height >= 100px) and (width >= 100px), (aspect-ratio > 3.5) {
    .Container {
        background: #000;
    }
}

/* Ignore this comment */

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
`;

export const cssOutput = `
.Container {
    border: none;
    /* Ignore this comment */
}

/* Ignore this comment */

.Container2 {
    border: 1px solid;
}

.Container2__element {
    background: green;
}
`;

export const statsOutput = {
  ".Container": {
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
  },
  ".Container2": {
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
  }
};
