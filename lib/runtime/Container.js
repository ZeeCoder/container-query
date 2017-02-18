'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _processConfig = require('./processConfig');

var _processConfig2 = _interopRequireDefault(_processConfig);

var _adjustContainer = require('./adjustContainer');

var _adjustContainer2 = _interopRequireDefault(_adjustContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(container, config) {
        _classCallCheck(this, _class);

        this.$container = $(container);
        this.adjust = this.adjust.bind(this);

        this.config = (0, _processConfig2.default)(config);

        this.adjust();
    }

    _createClass(_class, [{
        key: 'adjust',
        value: function adjust() {
            (0, _adjustContainer2.default)(this.$container, this.config);
        }
    }]);

    return _class;
}();

exports.default = _class;