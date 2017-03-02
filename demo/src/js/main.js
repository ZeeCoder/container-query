import Container from '@zeecoder/container-query/Container';

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

initialiseContainer(require('../css/components/user/user.json'));
initialiseContainer(require('../css/components/social-link/social-link.json'));
initialiseContainer(require('../css/components/social-container/social-container.json'));


// import initialiseAllContainers from '../initialiseAllContainers';

// const containers = require('./containers.css.json');

// initialiseAllContainers(containers);
