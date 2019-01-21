import React from "react";
import { withContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta } from "./Test.pcss";

const Test = () => <div className="Test" />;

export default withContainerQuery(Test, meta, { valuePrecision: 2 });
