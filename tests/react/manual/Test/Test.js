import React from "react";
import { withContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta as rawMeta } from "./Test.pcss";

// todo this shouldn't be needed
const meta = JSON.parse(rawMeta.slice(1, -1));

const Test = () => <div className="Test" />;

export default withContainerQuery(Test, meta);
