import Container from '../Container';

const userJSON = require('./containers/user.json');

const userContainer = new Container(
    document.getElementById('user'),
    userJSON
);

window.addEventListener('resize', userContainer.adjust);


// import initialiseAllContainers from '../initialiseAllContainers';

// const containers = require('./containers.css.json');

// initialiseAllContainers(containers);
