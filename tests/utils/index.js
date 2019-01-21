import ReactDOM from "react-dom";
import {
  getByTestId as rawGetByTestId,
  getNodeText,
  wait
} from "dom-testing-library";

let root = null;
let componentElement = null;
let customCssPropertiesSupported = null;

/**
 * @return {boolean}
 */
export const areCustomCssPropertiesSupported = () => {
  if (customCssPropertiesSupported === null) {
    document.body.style.setProperty("--test", "1px");

    customCssPropertiesSupported =
      document.body.style.getPropertyValue("--test") === "1px";
  }

  return customCssPropertiesSupported;
};

/**
 * @param {Component} component
 * @param {{width: int, height: int}} size
 * @return {HTMLElement}
 */
export const renderTestComponent = (
  component,
  size = { width: 100, height: 100 }
) => {
  root = document.createElement("div");
  root.style.position = "relative";
  changeRootSize(size);
  document.body.appendChild(root);

  ReactDOM.render(component, root);

  componentElement = root.children[0];

  return componentElement;
};

export const clearDOM = () => (document.body.innerHTML = "");

/**
 * Changing the root size, which results in changing the size of the component
 * rendered inside.
 * @param {int} width
 * @param {int} height
 */
export const changeRootSize = ({ width, height }) => {
  if (width) {
    root.style.width = `${width}px`;
  }

  if (height) {
    root.style.height = `${height}px`;
  }
};

/**
 * @param {string} id
 * @return {HTMLElement}
 */
export const getByTestId = id => rawGetByTestId(root, id);

/**
 * Asserts whether the given element has the expected styles.
 * @param {HTMLElement} element
 * @param {{}} style
 */
export const expectElementToHaveStyle = (element, style) => {
  const computedStyle = getComputedStyle(element);
  for (let prop of Object.keys(style)) {
    expect(computedStyle[prop]).toBe(style[prop]);
  }
};

/**
 * Asserts whether the currently rendered component has the expected styles.
 * @param {{}} style
 */
export const expectTestComponentToHaveStyle = style =>
  expectElementToHaveStyle(componentElement, style);

/**
 * The difference between this method and expectElementToHaveStyle is that the
 * previous one would make the current test fail immediately, while this one just
 * returns with a boolean.
 * This allows for a "waiting" to happen.
 * @param {HTMLElement} element
 * @param {{}} style
 * @return {boolean}
 */
export const testElementToHaveStyle = (element, style) => {
  const computedStyle = getComputedStyle(element);
  for (let prop of Object.keys(style)) {
    if (computedStyle[prop] !== style[prop]) {
      return false;
    }
  }

  return true;
};

/**
 * @param {{}} style
 */
export const testComponentToHaveStyle = style =>
  testElementToHaveStyle(componentElement, style);

/**
 * This method is necessary, as after a size change we have no way of knowing
 * exactly when the Resize observer might kick in in different browsers.
 * @param {HTMLElement} element
 * @param {style} style
 * @param {int} [timeout]
 * @return {Promise}
 */
export const waitForElementToHaveStyle = (element, style, timeout = 4500) =>
  new Promise((resolve, reject) => {
    const loop = () => {
      const hasStyle = testElementToHaveStyle(element, style);

      if (hasStyle) {
        clearTimeout(timeoutHandler);
        // This should succeed
        expectElementToHaveStyle(element, style);
        return resolve();
      }

      // Start in about the next animation frame
      requestAnimationFrame(loop);
    };

    const timeoutHandler = setTimeout(() => {
      // This should fail the test
      expectElementToHaveStyle(element, style);
      // The above should've made the test reject, but reject the promise as well regardless
      reject(
        new Error(
          "timeout on waiting for styles to change on the given element"
        )
      );
    }, timeout);

    loop();
  });

/**
 * @param {{}} style
 * @param {int} [timeout]
 * @return {Promise}
 */
export const waitForTestComponentToHaveStyle = (style, timeout = 4500) =>
  waitForElementToHaveStyle(componentElement, style, timeout);

/**
 * @param {HTMLElement} element
 * @param {{}} props
 */
export const expectElementToHaveCustomProperties = (element, props) => {
  // Not all browsers tested here support custom css properties
  if (!areCustomCssPropertiesSupported()) {
    return;
  }

  for (let prop of Object.keys(props)) {
    expect(element.style.getPropertyValue(prop)).toBe(props[prop]);
  }
};
/**
 * @param {HTMLElement} element
 * @param {{}} props
 * @return {boolean}
 */
export const testElementToHaveCustomProperties = (element, props) => {
  // Not all browsers tested here support custom css properties
  if (!areCustomCssPropertiesSupported()) {
    return true;
  }

  for (let prop of Object.keys(props)) {
    if (element.style.getPropertyValue(prop) !== props[prop]) {
      return false;
    }
  }

  return true;
};

/**
 * @param {{}} props
 */
export const expectTestComponentToHaveCustomProperties = props =>
  expectElementToHaveCustomProperties(componentElement, props);

/**
 * @param {HTMLElement} element
 * @param {{}} props
 * @param {int} timeout
 * @return {Promise}
 */
export const waitForElementToHaveCustomProperties = (
  element,
  props,
  timeout = 4500
) =>
  new Promise((resolve, reject) => {
    if (!areCustomCssPropertiesSupported()) {
      return resolve();
    }

    const loop = () => {
      const hasProps = testElementToHaveCustomProperties(element, props);

      if (hasProps) {
        clearTimeout(timeoutHandler);
        // This should succeed
        expectElementToHaveCustomProperties(element, props);
        return resolve();
      }

      // Start in about the next animation frame
      requestAnimationFrame(loop);
    };

    const timeoutHandler = setTimeout(() => {
      // This should fail the test
      expectElementToHaveCustomProperties(element, props);
      // The above should've made the test reject, but reject the promise as well regardless
      reject(
        new Error(
          "Timeout on waiting for custom props to change on the given element."
        )
      );
    }, timeout);

    loop();
  });

/**
 * @param {{}} props
 * @param {int} timeout
 * @return {Promise}
 */
export const waitForTestComponentToHaveCustomProperties = (
  props,
  timeout = 4500
) => waitForElementToHaveCustomProperties(componentElement, props, timeout);

/**
 * The reason we need this solution instead of just using wait() is because
 * jasmine's expect doesn't throw an exception on failure, but somehow communicates
 * that event back to the it() and describe() blocks, so that the test immediately
 * fails.
 *
 * @param {HTMLElement} element
 * @param {string} text
 * @return {Promise}
 */
export const expectTextContent = async (element, text) => {
  await wait(() => {
    const textContent = getNodeText(element);
    if (textContent !== text) {
      throw new Error(
        `Text content not yet what is expected. Got: ${textContent}. Expecting: ${text}.`
      );
    } else {
      expect(textContent).toBe(text);
    }
  });
};

const ucfirst = str => `${str[0].toUpperCase()}${str.slice(1)}`;

/**
 * Asserting with shorthands (like "border: x") doesn't work consistently across
 * browsers. (For example in firefox.)
 * This function can be used instead of asserting
 * `border: "2px solid rgb(255, 255, 255)"` as a whole for example.
 * @param {string} prop Ex: "border-width"
 * @param {string} value Ex: "2px"
 * @return {{}}
 */
export const createStyleFromShorthand = (prop, value) => {
  const style = {};

  const propParts = prop.split("-");

  const sides = ["Top", "Bottom", "Left", "Right"];

  sides.forEach(side => {
    style[`${propParts[0]}${side}${ucfirst(propParts[1])}`] = value;
  });

  return style;
};

/**
 * @param {HTMLElement} element
 * @param {{}[]} styles
 */
export const expectElementToHaveOneOfStyles = (element, styles) => {
  const styleCount = styles.length;
  for (let i = 0; i < styleCount; i++) {
    const success = testElementToHaveStyle(element, styles[i]);

    if (success) {
      return expectElementToHaveStyle(element, styles[i]);
    }
  }

  // non of the provided styles are available, report error
  // todo report which styles were tried, and what were the diffs
  fail("Non of the provided styles matched the element's style.");
};

/**
 * @param {{}[]} styles
 */
export const expectTestComponentToHaveOneOfStyles = styles =>
  expectElementToHaveOneOfStyles(componentElement, styles);
