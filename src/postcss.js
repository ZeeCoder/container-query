const postcss = require('postcss');
const fs = require('fs');
const trim = require('lodash.trim');
const camelCase = require('lodash.camelCase');
const CUNIT__HEIGHT = 'ch';
const CUNIT__WIDTH = 'cw';

function addDefaultsToContainer (container, defaultElementStyles, defaultElementValues) {
    let defaultQuery = { elements: [] };
    for (let elementSelector in defaultElementStyles) {
        let defaultElement = {
            selector: elementSelector,
            styles: {},
        };

        defaultElementStyles[elementSelector].forEach((prop) => {
            defaultElement.styles[prop] = '';
        });

        defaultQuery.elements.push(defaultElement);
    }
    container.queries.unshift(defaultQuery);

    let defaultValue = { elements: [] };
    for (let elementSelector in defaultElementValues) {
        let defaultElement = {
            selector: elementSelector,
            values: {},
        };

        defaultElementValues[elementSelector].forEach((prop) => {
            defaultElement.values[prop] = '';
        });

        defaultValue.elements.push(defaultElement);
    }
    container.values.unshift(defaultValue);
}

/**
 * @type {{ JSONSavePath: string }}
 */
module.exports = postcss.plugin('container-query', function myplugin(options) {

    return function (root) {

        let containers = {};

        options = options || {};

        // Processing code will be added her
        let currentContainer = null;
        let defaultElementStyles = {};
        let defaultElementValues = {};
        root.walkAtRules((rule) => {
            // todo: handle issues here, when for a @container declaration there's no defined-container

            if (rule.name === 'define-container') {
                containers[rule.parent.selector] = {
                    selector: rule.parent.selector,
                    queries: [],
                    values: [],
                };

                if (currentContainer !== null) {
                    addDefaultsToContainer(containers[currentContainer], defaultElementStyles, defaultElementValues);
                }

                currentContainer = rule.parent.selector;
                defaultElementStyles = {};
                defaultElementValues = {};

            } else if (rule.name === 'container') {
                let query = { conditions: [], elements: [] };
                let value = { conditions: [], elements: [] };

                let conditionArr = rule.params.match(/\(([^\)]*)\)/g);
                query.conditions = conditionArr.map((condition) => {
                    let conditionArr = trim(condition, '()');

                    conditionArr = conditionArr.match(/([a-z]*)([ :><=]*)([a-z0-9]*)/i);
                    conditionArr.shift();

                    conditionArr = conditionArr.map(trim);

                    return conditionArr;
                });

                value.conditions = query.conditions;

                rule.nodes.forEach((rule) => {
                    let queryElement = {
                        selector: rule.selector,
                        styles: {},
                    };
                    let attachQuery = false;

                    let valueElement = {
                        selector: rule.selector,
                        values: {},
                    };
                    let attachValue = false;

                    rule.nodes.forEach((declaration) => {
                        let prop = camelCase(declaration.prop);

                        if (
                            declaration.value.indexOf(CUNIT__HEIGHT) === -1 &&
                            declaration.value.indexOf(CUNIT__WIDTH) === -1
                        ) {
                            queryElement.styles[prop] = declaration.value;
                            attachQuery = true;

                            if (typeof defaultElementStyles[rule.selector] === 'undefined') {
                                defaultElementStyles[rule.selector] = [];
                            }

                            defaultElementStyles[rule.selector].push(prop);
                        } else {

                            let valueArr = declaration.value.match(/(\d*)([a-z]*)/i);
                            valueArr.shift();
                            valueArr[0] = parseInt(valueArr[0]) / 100;

                            valueElement.values[prop] = valueArr;
                            attachValue = true;

                            if (typeof defaultElementValues[rule.selector] === 'undefined') {
                                defaultElementValues[rule.selector] = [];
                            }

                            defaultElementValues[rule.selector].push(prop);
                        }
                    });

                    if (attachQuery) {
                        query.elements.push(queryElement);
                    }
                    if (attachValue) {
                        value.elements.push(valueElement);
                    }
                });

                if (query.elements.length > 0) {
                    containers[currentContainer].queries.push(query);
                }
                if (value.elements.length > 0) {
                    containers[currentContainer].values.push(value);
                }
            }
        });

        addDefaultsToContainer(containers[currentContainer], defaultElementStyles, defaultElementValues);

        fs.writeFileSync(options.JSONSavePath, JSON.stringify(containers, null, 2));
    };

});
