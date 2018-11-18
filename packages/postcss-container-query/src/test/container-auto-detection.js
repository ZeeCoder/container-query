import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
.Container {
  line-height: 3rh;
  border: none;
}

.Container {
  @define-container;
  font-size: 2rh;
}`;

export const meta = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "line-height": `3rh`,
            "font-size": `2rh`
          }
        }
      ]
    }
  ]
};

export const cssOutput = `
.Container {
  border: none;
}

.Container {
}

:export { meta: '${JSON.stringify(meta)}' }`;
