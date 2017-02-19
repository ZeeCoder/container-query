/**
 * @param {Object} styles
 * @param {HTMLElement[]} elements
 */
export default function applyStylesToElements (styles, elements) {
    elements.forEach((element) => {
        for (let prop in styles) {
            element.style[prop] = styles[prop];
        }
    });
}
