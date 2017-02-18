import processConfig from './processConfig';
import adjustContainer from './adjustContainer';

export default class {
    constructor (container, config) {
        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = processConfig(config);

        this.adjust();
    }

    adjust () {
        adjustContainer(this.$container, this.config);
    }
}
