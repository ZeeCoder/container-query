import React from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import styles, { meta as rawMeta } from "./styles.module.css";
import PropTypes from "prop-types";
import { remapMetaSelectors } from "../../../../packages/container-query-meta-builder/dist/bundle.esm";

// Since the container query postcss plugin runs before css-loader rewrites the
// classnames with css modules, we need to remap the classnames in the imported
// meta.
const meta = remapMetaSelectors(rawMeta, styles);

// reexporting styles for the tests
export { styles };

const Container = ({ children, id }) => (
  <ContainerQuery
    meta={meta}
    className={styles.container}
    data-testid={`root-${id}`}
  >
    <div className={styles.marker} data-testid={`marker-${id}`} />
    {children ? (
      <div className={styles.child} data-testid={`child-${id}`}>
        {children}
      </div>
    ) : null}
  </ContainerQuery>
);

Container.propTypes = {
  id: PropTypes.string
};

export default Container;
