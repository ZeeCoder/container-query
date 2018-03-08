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

export const meta = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "line-height": "1rw"
          }
        }
      ]
    },
    {
      [CONDITIONS]: [[["width", ">", 100]]],
      [ELEMENTS]: [
        {
          [VALUES]: {
            "line-height": "2rw"
          },
          [STYLES]: {
            border: "none"
          }
        }
      ]
    }
  ]
};
