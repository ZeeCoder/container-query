/**
 * Extracts conditions as arrays from a single "param" string PostCSS provides
 * for at-rules.
 *
 * @param {string} params
 *
 * @returns {string[]}
 */
export default function getConditionsFromQueryParams(params) {
  return params.split(",").map(andParams => {
    return andParams.match(/\(([^\)]*)\)/g).map(condition => {
      const conditionArr = condition.match(
        /\(([a-z-]*) *([:><=]*) *([a-z0-9\.]*)\)/i
      );

      if (["landscape", "portrait"].indexOf(conditionArr[3]) === -1) {
        conditionArr[3] = parseFloat(conditionArr[3]);
      }

      return conditionArr.slice(1);
    });
  });
}
