import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES,
  STYLES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

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

export const meta = {
  ".Container": {
    [SELECTOR]: ".Container",
    [QUERIES]: [
      {
        [ELEMENTS]: [
          {
            [VALUES]: {
              "font-size": `50rh`,
              "line-height": `100rh`
            }
          }
        ]
      },
      {
        [ELEMENTS]: [
          {
            [VALUES]: {
              "font-size": `70rh`
            }
          }
        ],
        [CONDITIONS]: [[["height", ">=", 100], ["width", ">=", 100]]]
      },
      {
        [ELEMENTS]: [
          {
            [STYLES]: {
              background: "none"
            }
          }
        ],
        [CONDITIONS]: [[["height", ">=", 100]]]
      },
      {
        [ELEMENTS]: [
          {
            [STYLES]: {
              background: "#000"
            }
          }
        ],
        [CONDITIONS]: [
          [["height", ">=", 100], ["width", ">=", 100]],
          [["aspect-ratio", ">", 3.5]]
        ]
      }
    ]
  },
  ".Container2": {
    [SELECTOR]: ".Container2",
    [QUERIES]: [
      {
        [ELEMENTS]: [
          {
            [SELECTOR]: ".Container2__element",
            [VALUES]: {
              width: `50rw`,
              height: `50rh`
            }
          }
        ]
      },
      {
        [ELEMENTS]: [
          {
            [VALUES]: {
              "font-size": `70rh`
            }
          },
          {
            [SELECTOR]: ".Container2__element",
            [STYLES]: {
              background: "red"
            },
            [VALUES]: {
              width: `75rw`,
              height: `75rh`
            }
          }
        ],
        [CONDITIONS]: [[["orientation", ":", "portrait"]]]
      }
    ]
  }
};

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

:export { meta: '${JSON.stringify(meta)}' }
`;
