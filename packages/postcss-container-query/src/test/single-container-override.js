import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
body {
  background: red;
}

.Container {
  @define-container;
  font-size: 1rh;
}`;

export const meta = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "font-size": `1rh`
          }
        }
      ]
    }
  ]
};

export const cssOutput = `
body {
  background: red;
}

.Container {
}

:export { meta: '${JSON.stringify(meta)}' }`;
