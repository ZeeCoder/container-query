import trim from 'lodash.trim';

/**
 * Extracts conditions as arrays from a single "param" string PostCSS provides
 * for at-rules.
 *
 * @param {string} params
 *
 * @returns {string[]}
 */
export default function getConditionsFromQueryParams (params) {
    return params.split(',').map((andParams) => {
        return andParams.match(/\(([^\)]*)\)/g).map((condition) => {
            let conditionArr = trim(condition, '()');

            conditionArr = conditionArr.match(/([a-z-]*)([ :><=]*)([a-z0-9\.]*)/i);
            conditionArr.shift();

            conditionArr = conditionArr.map(trim);

            if ([ 'landscape', 'portrait' ].indexOf(conditionArr[2]) === -1) {
                conditionArr[2] = parseFloat(conditionArr[2]);
            }

            return conditionArr;
        });
    });
}
