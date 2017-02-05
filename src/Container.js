import enhanceConfig from './enhanceConfig';
import adjustContainer from './adjustContainer';

// function enhance ($container, origConfig) {
//     let config = Object.assign({}, origConfig);
//
//     config.index = index++;
//
//     return config;
//
//     config.values.forEach((valueData, index, array) => {
//         if (typeof valueData.conditions !== 'undefined') {
//             return;
//         }
//
//         valueData.elements.forEach((elementData, index, array) => {
//             let $element = $container.find(elementData.selector);
//             if (!$element.length) {
//                 array.splice(index, 1);
//
//                 return;
//             }
//
//             elementData.$element = $element;
//         });
//     });
//
//     return config;
// }

export default class {
    constructor (container, config) {
        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = enhanceConfig(this.$container, config);

        this.adjust();
    }

    adjust () {
        adjustContainer(this.$container, this.config);
    }
}
