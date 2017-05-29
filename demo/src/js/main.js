import Container from "@zeecoder/container-query/Container";

const containers = require("./containers.json");

function initialiseContainer(jsonData) {
    /**
     * @type NodeList
     */
    const htmlElements = document.querySelectorAll(jsonData.selector);
    const htmlElementsLength = htmlElements.length;

    for (let i = 0; i < htmlElementsLength; i++) {
        // console.log(htmlElements[i]);
        const containerInstance = new Container(htmlElements[i], jsonData, {
            adjustOnResize: true
        });

        // const containerInstance = new Container(htmlElements[i], jsonData);
        // window.addEventListener('resize', containerInstance.adjust);
        // requestAnimationFrame(() => {
        //     containerInstance.adjust();
        // });
    }
}

containers.forEach(containerFileName => {
    initialiseContainer(
        require(`../css/components/${containerFileName}/${containerFileName}.json`)
    );
});

function startAnimating() {
    let isWide = false;
    const element = document.getElementById("to-animate");

    function doAnimate() {
        if (isWide) {
            element.style.width = "100px";
        } else {
            element.style.width = "700px";
        }

        isWide = !isWide;

        setTimeout(doAnimate, 1000);
    }

    doAnimate();
}

setTimeout(startAnimating, 3000);

// import initialiseAllContainers from '../initialiseAllContainers';

// const containers = require('./containers.css.json');

// initialiseAllContainers(containers);
