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

export const statsOutput = {
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
};
