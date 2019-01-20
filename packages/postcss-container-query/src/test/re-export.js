import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  STYLES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
.App {
  color: red;
}

:export {
  something: else;
  meta: '{"${SELECTOR}":".App","${QUERIES}":[{"${ELEMENTS}":[{"${STYLES}":{"color":"green"}}],"${CONDITIONS}":[[["width",">",100]]]}]}';
}
`;

export const meta = {
  [SELECTOR]: ".App",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [STYLES]: {
            color: "green"
          }
        }
      ],
      [CONDITIONS]: [[["width", ">", 100]]]
    }
  ]
};

export const cssOutput = cssInput;
