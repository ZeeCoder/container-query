import React from "react";
import ReactDOM from "react-dom";
import Basic from "./Basic/Basic";

const delay = time => new Promise(resolve => setTimeout(resolve, time));

it("should render Basic", async () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(<Basic />, div);

  const rendered = document.getElementById("rendered-component");

  // Assertions before the ResizeObserver kicks in
  expect(rendered.textContent).toBe("1x1");

  // wait a little before asserting
  await delay(50);

  expect(rendered.textContent).toBe("101x100");
  expect(rendered.style.backgroundColor).toBe("green");
});
