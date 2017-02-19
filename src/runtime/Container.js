import processConfig from './processConfig';
import adjustContainer from './adjustContainer';

/**
 * @class
 * @property {HTMLElement} container
 * @property {Object} config
 */
export default class Container {
    constructor (container, config) {
        this.container = container;
        this.config = processConfig(config);

        this.adjust = this.adjust.bind(this);

        this.adjust();
    }

    adjust () {
        adjustContainer(this.container, this.config);
    }
}
