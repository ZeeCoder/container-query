import React, { useState } from "react";
import useContainerQuery from "../../../../packages/use-container-query/dist/bundle.esm";
import { meta } from "./Test.pcss";

const Test = () => {
  const [size, handleResize] = useState({ width: 1, height: 1 });
  const ref = useContainerQuery(meta, {
    valuePrecision: 2,
    // todo make handleResize always return an object with some width / height
    //      value
    handleResize
  });

  // todo test getting the size here
  return (
    <div className="Test" ref={ref}>
      {size.width}x{size.height}
    </div>
  );
};

export default Test;
