export const cssInput = `
.Container {
  line-height: 1rw;
  border: 1px solid;
}

@container (width > 100px) {
  :self {
    line-height: 2rw;
    border: none;
  }
}
`;

export const cssOutput = `
.Container {
  border: 1px solid;
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
            "line-height": "1rw"
          }
        }
      ]
    },
    {
      conditions: [[["width", ">", 100]]],
      elements: [
        {
          selector: ":self",
          values: {
            "line-height": "2rw"
          },
          styles: {
            border: "none"
          }
        }
      ]
    }
  ]
};
