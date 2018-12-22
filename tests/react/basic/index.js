import React from "react";
import Basic from "./Basic/Basic";
import { wait, getNodeText } from "dom-testing-library";
import {
  renderTestComponent,
  getByTestId,
  changeRootSize,
  expectTestComponentToHaveStyle,
  expectTestComponentToHaveCustomProperties,
  expectElementToHaveStyle,
  clearDOM,
  expectTextContent
} from "../../utils";

// Features covered:
// - Style applying and restoring on width, height and orientation change
// - rw / rh unit applying / removing (With max precision of 4)
// - All the above on a descendant
// - Getting the size from the ContainerQuery component
describe("Basic", () => {
  const refs = {};
  beforeAll(() => {
    clearDOM();
    renderTestComponent(<Basic />, {
      width: 100,
      height: 50
    });

    refs.content = getByTestId("content");
  });

  it("should not have any of the container queries applied", async () => {
    // Assertions before the ResizeObserver kicks in
    expect(getNodeText(refs.content)).toBe("1x1");

    // Wait for resize observer to kick in
    await expectTextContent(refs.content, "100x50");

    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "50px"
    });

    expectTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)",
      color: "rgb(0, 0, 0)",
      border: "2px solid rgb(255, 255, 255)"
    });

    expectElementToHaveStyle(refs.content, {
      textAlign: "center",
      fontSize: "25px", // 50rh
      lineHeight: "50px" // 100rh
    });
  });

  it("should react to width change", async () => {
    await changeRootSize({ width: 101 });

    expectTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 128, 0)",
      border: "4.03125px solid rgb(255, 255, 255)"
    });
    expectTestComponentToHaveCustomProperties({
      "--w": "101px",
      "--h": "50px"
    });
  });

  it("should revert styles after width changes back", async () => {
    await changeRootSize({ width: 100 });

    expectTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)",
      border: "2px solid rgb(255, 255, 255)"
    });
    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "50px"
    });
  });

  it("should react to height change", async () => {
    await changeRootSize({ height: 51 });

    expectTestComponentToHaveStyle({
      color: "rgb(255, 255, 255)",
      border: "2.03125px solid rgb(255, 255, 255)"
    });
    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "51px"
    });
  });

  it("should revert styles after height changes back", async () => {
    await changeRootSize({ height: 50 });

    expectTestComponentToHaveStyle({
      color: "rgb(0, 0, 0)",
      border: "2px solid rgb(255, 255, 255)"
    });
    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "50px"
    });
  });

  it("should handle all queries at the same time", async () => {
    // changing to portrait, as well as being bigger than 100x50
    await changeRootSize({ width: 200, height: 300 });

    await expectTextContent(refs.content, "200x300");

    expectTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 128, 0)",
      color: "rgb(255, 255, 255)",
      border: "4px solid rgb(0, 0, 0)"
    });
    expectTestComponentToHaveCustomProperties({
      "--w": "200px",
      "--h": "300px"
    });

    expectElementToHaveStyle(refs.content, {
      fontWeight: "700",
      fontSize: "45px" // 15rh
    });
  });
});
