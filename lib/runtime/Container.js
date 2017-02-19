'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _processConfig = require('./processConfig');

var _processConfig2 = _interopRequireDefault(_processConfig);

var _adjustContainer = require('./adjustContainer');

var _adjustContainer2 = _interopRequireDefault(_adjustContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @property {HTMLElement} container
 * @property {Object} config
 */
var Container = function Container(container, config) {
    _classCallCheck(this, Container);

    this.adjust = _adjustContainer2.default.bind(this, container, (0, _processConfig2.default)(config));

    this.adjust();
};

exports.default = Container;