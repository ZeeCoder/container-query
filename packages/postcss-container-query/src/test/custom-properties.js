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
  selector: ".Container",
  queries: [
    {
      elements: [
        {
          selector: ".Container",
          values: {
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
