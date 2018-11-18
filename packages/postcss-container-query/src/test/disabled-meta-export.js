import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
.Container {
  line-height: 1rh;
}

@container (width > 100px) {
  :self {
    line-height: 2rh;
  }
}
`;

export const meta = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "line-height": "1rh"
          }
        }
      ]
    },
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "line-height": "2rh"
          }
        }
      ],
      [CONDITIONS]: [[["width", ">", 100]]]
    }
  ]
};

export const cssOutput = `
.Container {
}
`;
