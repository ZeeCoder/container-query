/**
 * @param {Object} styles
 * @param {NodeList<HTMLElement>} elements
 */
export default function applyStylesToElements(styles, elements) {
  const elementsLength = elements.length;

  for (let i = 0; i < elementsLength; i++) {
    for (let prop in styles) {
      elements[i].style[prop] = styles[prop];
      // Equivalent to setProperty, see: https://devdocs.io/dom/cssstyledeclaration/setproperty
    }
  }
}
