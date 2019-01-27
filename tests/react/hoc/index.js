import React from "react";
import Test from "./Test/Test";
import {
  renderTestComponent,
  clearDOM,
  waitForTestComponentToHaveStyle,
  changeRootSize,
  waitForTestComponentToHaveCustomProperties,
  waitForElementToHaveStyle
} from "../../utils";

// Features covered:
// - HoC should work the same as the render-prop or hook version
// - HoC should pass in Container class options (Like value precision.)
describe("withContainerQuery", () => {
  beforeAll(() => {
    clearDOM();
    renderTestComponent(<Test />, {
      width: 100,
      height: 50
    });
  });

  it("should apply styles to the body", async () => {
    await waitForElementToHaveStyle(document.body, {
      backgroundColor: "rgb(200, 200, 200)"
    });
  });

  it("should not have any of the container queries applied", async () => {
    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)"
    });

    await waitForTestComponentToHaveCustomProperties({
      "--w": "1px"
    });
  });

  it("should react to width change", async () => {
    changeRootSize({ width: 101 });
    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 255, 0)"
    });

    await waitForTestComponentToHaveCustomProperties({
      "--w": "1.01px"
    });
  });
});
