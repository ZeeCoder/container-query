import adjustValueObjectByContainerSize from "./adjustValueObjectByContainerSize";

test("container value object gets all its values converted to pixels", () => {
  expect(
    adjustValueObjectByContainerSize(
      { height: 100, width: 150 },
      {
        fontSize: `50rh`,
        lineHeight: `100rh`,
        borderWidth: `50rw`,
        padding: `10rh 10rw 10rh`
      }
    )
  ).toEqual({
    fontSize: "50.00px",
    lineHeight: "100.00px",
    borderWidth: "75.00px",
    padding: "10.00px 15.00px 10.00px"
  });
});
