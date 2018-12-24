import React from "react";
import Basic from "./Basic/Basic";
import { getNodeText } from "dom-testing-library";
import {
  renderTestComponent,
  getByTestId,
  changeRootSize,
  expectTestComponentToHaveStyle,
  expectTestComponentToHaveCustomProperties,
  expectElementToHaveStyle,
  clearDOM,
  expectTextContent,
  waitForTestComponentToHaveStyle,
  createStyleFromShorthand,
  testElementToHaveStyle,
  expectTestComponentToHaveOneOfStyles
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
    // Wait for resize observer to kick in
    await expectTextContent(refs.content, "100x50");

    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "50px"
    });

    expectTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)",
      color: "rgb(0, 0, 0)",
      ...createStyleFromShorthand("border-width", "2px"),
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(255, 255, 255)")
    });

    expectElementToHaveStyle(refs.content, {
      textAlign: "center",
      fontSize: "25px", // 50rh
      lineHeight: "50px" // 100rh
    });
  });

  it("should react to width change", async () => {
    changeRootSize({ width: 101 });

    await expectTextContent(refs.content, "101x50");

    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 128, 0)",
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(255, 255, 255)")
    });

    expectTestComponentToHaveOneOfStyles([
      createStyleFromShorthand("border-width", "4px"), // most browsers do rounding
      createStyleFromShorthand("border-width", "4.04px"), // what I would really want, but only IE / Edge reports this properly
      createStyleFromShorthand("border-width", "4.03125px") // This is what chrome reports >=v58 for some reason...
    ]);

    expectTestComponentToHaveCustomProperties({
      "--w": "101px",
      "--h": "50px"
    });
  });

  it("should revert styles after width changes back", async () => {
    changeRootSize({ width: 100 });

    await expectTextContent(refs.content, "100x50");

    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(255, 0, 0)",
      ...createStyleFromShorthand("border-width", "2px"),
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(255, 255, 255)")
    });

    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "50px"
    });
  });

  it("should react to height change", async () => {
    changeRootSize({ height: 51 });

    await expectTextContent(refs.content, "100x51");

    await waitForTestComponentToHaveStyle({
      color: "rgb(255, 255, 255)",
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(255, 255, 255)")
    });

    expectTestComponentToHaveOneOfStyles([
      createStyleFromShorthand("border-width", "2px"), // most browsers do rounding
      createStyleFromShorthand("border-width", "2.04px"), // what I would really want, but only IE / Edge reports this properly
      createStyleFromShorthand("border-width", "2.03125px") // This is what chrome reports >=v58 for some reason...
    ]);

    expectTestComponentToHaveCustomProperties({
      "--w": "100px",
      "--h": "51px"
    });
  });

  it("should revert styles after height changes back", async () => {
    await changeRootSize({ height: 50 });

    await expectTextContent(refs.content, "100x50");

    await waitForTestComponentToHaveStyle({
      color: "rgb(0, 0, 0)",
      ...createStyleFromShorthand("border-width", "2px"),
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(255, 255, 255)")
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

    await waitForTestComponentToHaveStyle({
      backgroundColor: "rgb(0, 128, 0)",
      color: "rgb(255, 255, 255)",
      ...createStyleFromShorthand("border-width", "4px"),
      ...createStyleFromShorthand("border-style", "solid"),
      ...createStyleFromShorthand("border-color", "rgb(0, 0, 0)")
    });

    expectTestComponentToHaveCustomProperties({
      "--w": "200px",
      "--h": "300px"
    });

    // Chrome <= 61 wrongly reports "bold" instead of 700, so we test the assertion first
    const haveStyle = testElementToHaveStyle(refs.content, {
      fontWeight: "700"
    });

    if (haveStyle) {
      expectElementToHaveStyle(refs.content, {
        fontWeight: "700"
      });
    } else {
      // Handle Chrome <= 61 differently
      expectElementToHaveStyle(refs.content, {
        fontWeight: "bold"
      });
    }
    expectElementToHaveStyle(refs.content, {
      fontSize: "45px" // 15rh
    });
  });
});
