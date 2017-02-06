import Container from '../src/Container';

const containerConfigs = require('./containers.json');

let containers = [];

for (let containerSelector in containerConfigs) {
    $(containerSelector).each(function () {
        containers.push(
            new Container(
                this,
                Object.assign({}, containerConfigs[containerSelector])
            )
        );
    });
}



$(window).on('resize', () => {
    containers.forEach((container) => {
        container.adjust();
    });
})
