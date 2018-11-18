/**
 * @param {Object} styles
 * @param {NodeList<HTMLElement>} elements
 */
export default function applyStylesToElements(styles, elements) {
  const elementsLength = elements.length;

  for (let i = 0; i < elementsLength; i++) {
    for (let prop in styles) {
      // Even though `style[prop] = value` is equivalent for the most part, we
      // need to use setProperty to support setting css custom props as well.
      elements[i].style.setProperty(prop, styles[prop]);
    }
  }
}
