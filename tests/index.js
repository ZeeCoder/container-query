import React from "react";
import ReactDOM from "react-dom";
// Using the following to support async/await in tests.
// I'm intentionally not using babel/polyfill, as that would introduce polyfills
// the actual lib might not have, giving the false impression that something
// works while it might actually not, if you use the lib without babel-polyfill.
import "babel-regenerator-runtime";

const Test = () => <div id="asd" style={{ background: "grey" }} />;

it("should render", async () => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(<Test />, div);

  const rendered = document.querySelector("#asd");

  expect(rendered.style.backgroundColor).toBe("grey");
});
