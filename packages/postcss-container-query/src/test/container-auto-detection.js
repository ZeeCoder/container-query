export const cssInput = `
.Container {
  line-height: 3rh;
  border: none;
}

.Container {
  @define-container;
  font-size: 2rh;
}
`;

export const cssOutput = `
.Container {
  border: none;
}

.Container {
}
`;

export const statsOutput = {
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
};
