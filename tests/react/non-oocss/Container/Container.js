import React from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta } from "./styles.pcss";
import PropTypes from "prop-types";

const Container = ({ children, id }) => (
  <ContainerQuery
    meta={meta}
    className="container"
    data-testid={`root-${id}`}
    options={
      {
        // Generating whole numbers to make assertions simpler across browsers
        // todo test this somewhere else
        // valuePrecision: 0
      }
    }
  >
    <div className="marker" data-testid={`marker-${id}`} />
    {children ? (
      <div className="child" data-testid={`child-${id}`}>
        {children}
      </div>
    ) : null}
  </ContainerQuery>
);

Container.propTypes = {
  id: PropTypes.string
};

export default Container;
