import React from "react";
import Test from "./Test/Test";
import {
  renderTestComponent,
  clearDOM,
  waitForTestComponentToHaveStyle,
  changeRootSize
} from "../../utils";

// Features covered:
// - HoC should work the same as the render-prop or hook version
describe("withContainerQuery", () => {
  beforeAll(() => {
    clearDOM();
    renderTestComponent(<Test />, {
      width: 100,
      height: 50
    });
  });

  it("should not have any of the container queries applied", async () => {
    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)"
    });
  });

  it("should react to width change", async () => {
    changeRootSize({ width: 101 });
    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 255, 0)"
    });
  });
});
