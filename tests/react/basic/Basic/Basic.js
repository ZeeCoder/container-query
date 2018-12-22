import React, { Component } from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta as rawMeta } from "./Basic.pcss";

// todo this shouldn't be needed
const meta = JSON.parse(rawMeta.slice(1, -1));

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
