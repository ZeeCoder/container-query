// polyfilling
import "core-js/fn/object/assign";

import App from "./components/App/App";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("app"));
