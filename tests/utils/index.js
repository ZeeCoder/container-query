import ReactDOM from "react-dom";
import {
  getByTestId as rawGetByTestId,
  getNodeText,
  wait
} from "dom-testing-library";

let root = null;
let componentElement = null;

const waitForAnimationFrame = () =>
  new Promise(resolve => requestAnimationFrame(resolve));

const waitForNAnimationFrame = async n => {
  for (let i = 0; i < n; i++) {
    await waitForAnimationFrame();
  }
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
export const changeRootSize = async ({ width, height }) => {
  if (width) {
    root.style.width = `${width}px`;
  }

  if (height) {
    root.style.height = `${height}px`;
  }

  // Style changes will be applied in the first frame, and then they'll be
  // accessible in the one after that.
  // (Waiting 1 frame would result us querying the element in the same frame it's
  // expected to be updated.)
  await waitForNAnimationFrame(2);
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
