'use strict';

const processConfig = require('./processConfig');
const adjustContainer = require('./adjustContainer');

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
