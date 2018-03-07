// To trigger the error, we need to at least have one declaration.
// Otherwise the plugin will just ignore the whole rule.
export const cssInput = `
@container (orientation: landscape) {
  .child {
    color: inherit;
  }
}
`;
