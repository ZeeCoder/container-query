import {
  SELECTOR,
  QUERIES,
  ELEMENTS,
  VALUES,
  CONDITIONS
} from "@zeecoder/container-query-meta-builder";

export const cssInput = `
.Container {
  --rw: 1rw;
  --rh: 1rh;
  --rmin: 1rmin;
  --rmax: 1rmax;
}
`;

export const cssOutput = `
.Container {
}
`;

export const statsOutput = {
  [SELECTOR]: ".Container",
  [QUERIES]: [
    {
      [ELEMENTS]: [
        {
          [VALUES]: {
            "--rw": `1rw`,
            "--rh": `1rh`,
            "--rmin": `1rmin`,
            "--rmax": `1rmax`
          }
        }
      ]
    }
  ]
};
