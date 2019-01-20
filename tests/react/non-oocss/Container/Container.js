import React from "react";
import { ContainerQuery } from "../../../../packages/react-container-query/dist/bundle.esm";
import styles, { meta } from "./styles.module.css";
import PropTypes from "prop-types";
import { remapMetaSelectors } from "../../../../packages/container-query-meta-builder/dist/bundle.esm";

// re-exporting for the tests
export { styles };

// Since the container query postcss plugin runs before css-loader rewrites the
// classnames with css modules, we need to remap the classnames in the imported
// meta runtime.
const metaObj = JSON.parse(meta.slice(1, -1));
const containerMeta = remapMetaSelectors(metaObj[".container"], styles);
const labelMeta = remapMetaSelectors(metaObj[".label"], styles);

const Container = ({ children, id }) => (
  <ContainerQuery
    meta={containerMeta}
    className={styles.container}
    data-testid={`root-${id}`}
  >
    <div className={styles.marker} data-testid={`marker-${id}`} />
    <ContainerQuery
      meta={labelMeta}
      className={styles.label}
      as="span"
      data-testid={`label-${id}`}
    >
      Container id: "{id}"
    </ContainerQuery>
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
