import Container from './src/Container';

const config = require('./container.json');

let containers = [];
$(config.selector).each(function () {
    containers.push(new Container(this, Object.assign({}, config)));
});

$(window).on('resize', () => {
    containers.forEach((container) => {
        container.adjust();
    });
})
