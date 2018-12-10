import { SELECTOR, QUERIES, ELEMENTS } from "./constants";

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
 * Replaces the classes in the given styles map
 * @param {string} selector
 * @param {{}} styles
 * @return {string}
 */
const updateSelector = (selector, styles) => {
  for (let className of Object.keys(styles)) {
    selector = selector.replace(new RegExp(className, "g"), styles[className]);
  }

  return selector;
};

/**
 * Rewrites the meta selectors according to the styles map object.
 * @param {{}} rawMeta
 * @param {{}} styles A classname => classname map, like the one CSS Modules provides.
 * Ex: "{ App: "App_ehyfd" }"
 * @return {{}}
 */
const remapMetaSelectors = (rawMeta, styles) => {
  // If meta is a string, then assume it's from a css-loader export.
  // Unfortunately css-loader will add quotations around the exported JSON, so
  // we need to trim that.
  const meta =
    typeof rawMeta === "string" ? JSON.parse(rawMeta.slice(1, -1)) : rawMeta;

  // We need to differentiate between single- and multi container mode here, as
  // the meta object's structure would be slightly different.
  if (meta[SELECTOR]) {
    mapMetaSelectors(meta, selector => updateSelector(selector, styles));
  } else {
    for (let selector of Object.keys(meta)) {
      mapMetaSelectors(meta[selector], selector =>
        updateSelector(selector, styles)
      );
    }
  }

  return meta;
};

export default remapMetaSelectors;
