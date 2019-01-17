import React from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import { meta } from "./styles.pcss";
import PropTypes from "prop-types";

const Container = ({ children, id }) => (
  <ContainerQuery meta={meta} className="container" data-testid={`root-${id}`}>
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
