const postcss = require('postcss');
const trim = require('lodash.trim');
const camelCase = require('lodash.camelCase');

module.exports = postcss.plugin('container-query', function myplugin(options) {

    return function (root) {

        let containers = {};

        options = options || {};

        // Processing code will be added her
        let lastContainer;
        root.walkAtRules((rule) => {
            // todo: handle issues here, when for a @container declaration there's no defined-container
            if (rule.name === 'define-container') {
                containers[rule.parent.selector] = {
                    selector: rule.parent.selector,
                    queries: [],
                    values: [],
                };
                lastContainer = rule.parent.selector;
            } else if (rule.name === 'container') {
                let query = { conditions: [], elements: [] };
                let conditionArr = rule.params.match(/\(([^\)]*)\)/g);
                query.conditions = conditionArr.map((condition) => {
                    let conditionArr = trim(condition, '()');

                    conditionArr = conditionArr.match(/([a-z]*)([ :><=]*)([a-z0-9]*)/i);
                    conditionArr.shift();

                    conditionArr = conditionArr.map(trim);

                    return conditionArr;
                });

                rule.nodes.forEach((rule) => {
                    let element = {
                        selector: rule.selector,
                        styles: {},
                    };

                    rule.nodes.forEach((declaration) => {
                        element.styles[camelCase(declaration.prop)] = declaration.value;
                    });

                    query.elements.push(element);
                });

                containers[lastContainer].queries.push(query);
            }
        });

        console.log(JSON.stringify(containers, null, 2));
    };

});
