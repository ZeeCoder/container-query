/**
 * Runs through all selectors of a meta object.
 * @param {{}} meta
 * @param {function} cb
 */
const mapMetaSelectors = (meta, cb) => {
  if (typeof meta[SELECTOR] === "string") {
    meta[SELECTOR] = cb(meta[SELECTOR]);
  }

  // Patching the elements' selectors
  if (Array.isArray(meta[QUERIES])) {
    meta[QUERIES].forEach(query => {
      if (Array.isArray(query[ELEMENTS])) {
        query[ELEMENTS].forEach(element => {
          if (typeof element[SELECTOR] === "string") {
            element[SELECTOR] = cb(element[SELECTOR]);
          }
        });
      }
    });
  }
};

/**
 * Rewrites the meta selectors according to the styles map object.
 * @param {{}} rawMeta
 * @param {{}} styles A classname => classname map, like the one CSS Modules provides.
 * Ex: "{ App: "App_ehyfd" }"
 * @return {{}}
 */
const remapMetaSelectors = (rawMeta, styles) => {
  // If meta is a string, then assume it's from a css-loader export
  // todo trim quotations instead of just slicing
  const meta =
    typeof rawMeta === "string" ? JSON.parse(rawMeta.slice(1, -1)) : rawMeta;

  /**
   * Checks if the given css selector has a hashed css class in the given `styles`
   * object
   * @param {string} selector Ex: ".App"
   * @return {boolean}
   */
  const hasSelectorInStyles = selector =>
    typeof styles[selector.slice(1)] === "string";

  /**
   * Returns a hashed css class to the given selector, from the styles object.
   * @param {string} selector Ex: ".App"
   * @return {string} Ex: ".App_wCjtv"
   */
  const getMappedCssClass = selector => `.${styles[selector.slice(1)]}`;

  mapMetaSelectors(meta, selector => {
    if (!hasSelectorInStyles(selector)) {
      return selector;
    }

    return getMappedCssClass(selector);
  });

  return meta;
};

export default remapMetaSelectors;
