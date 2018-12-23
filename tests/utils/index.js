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

export const isFirefox = () =>
  navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;

export const isChrome = () =>
  navigator.userAgent.toLowerCase().indexOf("chrome") !== -1;

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
 * Asserts whether the currently rendered component has the expected styles.
 * @param {{}} style
 */
export const expectTestComponentToHaveStyle = style =>
  expectElementToHaveStyle(componentElement, style);

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
      const hasStyle = testElementToHaveStyle(componentElement, style);

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
  for (let prop of Object.keys(props)) {
    expect(element.style.getPropertyValue(prop)).toBe(props[prop]);
  }
};

/**
 * @param {{}} props
 */
export const expectTestComponentToHaveCustomProperties = props =>
  expectElementToHaveCustomProperties(componentElement, props);

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
