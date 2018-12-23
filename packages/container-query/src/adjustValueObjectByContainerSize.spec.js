import adjustValueObjectByContainerSize from "./adjustValueObjectByContainerSize";

test("should adjust the given value object's props to pixel units", () => {
  expect(
    adjustValueObjectByContainerSize(
      { height: 100, width: 150 },
      {
        fontSize: "50rh",
        lineHeight: "101.123rh",
        borderWidth: "52.5rw",
        padding: "11rh 12rw 13rh"
      }
    )
  ).toEqual({
    fontSize: "50px",
    lineHeight: "101.12px",
    borderWidth: "78.75px",
    padding: "11px 18px 13px"
  });
});
