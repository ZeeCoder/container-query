import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES,
  STYLES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
.unrelated-class {
  color: black;
}

.Container {
  line-height: 2rh;
  @define-container;
  border: none;
}

/* This should be noticed, and processed as expected */
.Container {
  font-size: 1rh;
}

@keyframes Expand {
  0% {
    opacity: 0%;
  }

  100% {
    opacity: 100%;
  }
}

@container (orientation: landscape) {
  .Container {
    font-size: 24px;
  }
}

/* Should ignore empty container query */
@container (orientation: portrait) {
  .Container {}
}

/* should process container values even after container queries */
.Container  {
  line-height: 3rh;
  margin-left: 2rw;
}

/* should process default elements using values */
.Container__element {
  font-size: 1rw;
}

/* This should be overriden by the following node */
.Container__element {
  line-height: 1rw;
}

.Container__element {
  line-height: 2rw;
}
`;

export const cssOutput = `
.unrelated-class {
  color: black;
}

.Container {
  border: none;
}

/* This should be noticed, and processed as expected */
.Container {
}

@keyframes Expand {
  0% {
    opacity: 0%;
  }

  100% {
    opacity: 100%;
  }
}

/* Should ignore empty container query */

/* should process container values even after container queries */
.Container  {
}

/* should process default elements using values */
.Container__element {
}

/* This should be overriden by the following node */
.Container__element {
}

.Container__element {
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
              "line-height": `3rh`,
              "font-size": `1rh`,
              "margin-left": `2rw`
            }
          },
          {
            [SELECTOR]: ".Container__element",
            [VALUES]: {
              "font-size": `1rw`,
              "line-height": `2rw`
            }
          }
        ]
      },
      {
        [CONDITIONS]: [[["orientation", ":", "landscape"]]],
        [ELEMENTS]: [
          {
            [STYLES]: { "font-size": "24px" }
          }
        ]
      }
    ]
  }
};
