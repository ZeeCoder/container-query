import processConfig from './processConfig';
import adjustContainer from './adjustContainer';

/**
 * @class
 * @property {HTMLElement} container
 * @property {Object} config
 */
export default class Container {
    constructor (container, config) {
        this.adjust = adjustContainer.bind(
            this,
            container,
            processConfig(config)
        );

        this.adjust();
    }
}
