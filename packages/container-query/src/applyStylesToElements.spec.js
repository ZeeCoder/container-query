import applyStylesToElements from "./applyStylesToElements";

test("should apply all declarations to all the elements", () => {
  const element1 = {
    style: {}
  };
  const element2 = {
    style: {}
  };

  const elements = [element1, element2];

  const style = {
    "font-size": "42px",
    "line-height": "50px"
  };

  applyStylesToElements(style, elements);

  expect(element1.style).toEqual(style);
  expect(element2.style).toEqual(style);
});
