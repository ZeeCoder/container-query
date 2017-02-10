import processConfig from '../lib/processConfig';
import adjustContainer from '../lib/adjustContainer';

export default class {
    constructor (container, config) {
        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = processConfig(this.$container, config);

        this.adjust();
    }

    adjust () {
        adjustContainer(this.$container, this.config);
    }
}
