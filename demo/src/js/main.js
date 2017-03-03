import Container from '@zeecoder/container-query/Container';

const containers = require('./containers.json');

function initialiseContainer (jsonData) {
    /**
     * @type NodeList
     */
    const htmlElements = document.querySelectorAll(jsonData.selector);
    const htmlElementsLength = htmlElements.length;

    for (let i = 0; i < htmlElementsLength; i++) {
        const containerInstance = new Container(htmlElements[i], jsonData);
        window.addEventListener('resize', containerInstance.adjust);
        requestAnimationFrame(() => {
            containerInstance.adjust();
        });
    }
}

containers.forEach((containerFileName) => {
    initialiseContainer(require(`../css/components/${containerFileName}/${containerFileName}.json`));
});


// import initialiseAllContainers from '../initialiseAllContainers';

// const containers = require('./containers.css.json');

// initialiseAllContainers(containers);
