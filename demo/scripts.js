import Container from '../Container';

const containerConfigs = require('./containers.json');

let containers = [];

for (let containerSelector in containerConfigs) {
    document.querySelectorAll(containerSelector).forEach((element) => {
        containers.push(
            new Container(
                element,
                containerConfigs[containerSelector]
            )
        );
    });
}

window.addEventListener('resize', () => {
    containers.forEach((container) => {
        container.adjust();
    });
});
