import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES
} from "@zeecoder/container-query-meta-builder";

// These container definitions should be merged together, as they use the same
// selector
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
