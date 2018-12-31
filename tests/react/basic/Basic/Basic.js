import React from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta } from "./Basic.pcss";

const Basic = () => (
  <ContainerQuery meta={meta} className="Basic">
    {(width, height) => {
      return (
        <div className="Basic__content" data-testid="content">
          {width}x{height}
        </div>
      );
    }}
  </ContainerQuery>
);

export default Basic;
