export const cssInput = `
body {
  /* This would be picked up as the container normally in singleContainer mode. */
}

.Container {
  /* One override is allowed */
  @define-container;
  line-height: 3rh;
  border: none;
}

.AnotherContainer {
  /* Two override is not allowed */
  @define-container;
  font-size: 2rh;
}
`;
