import initialiseAllContainers from "./initialiseAllContainers";

jest.mock('./runtime/Container');

test('should initialise all containers and adjust them on window resize', () => {
    const Container = require('./runtime/Container').default;
    Container.prototype.adjust = jest.fn();

    const container1Config = {
        selector: '.container1',
        queries: [],
    };
    const container2Config = {
        selector: '.container2',
        queries: [],
    };

    const containers = {
        '.container1': container1Config,
        '.container2': container2Config,
    };

    const container1Element1 = {};
    const container1Element2 = {};
    const container2Element1 = {};

    document.querySelectorAll = jest.fn((selector) => {
        if (selector === '.container1') {
            return [ container1Element1, container1Element2 ];
        } else {
            return [ container2Element1 ];
        }
    });

    let triggerWindowResize = null;
    let triggerDOMContentLoaded = null;
    document.addEventListener = jest.fn((type, fn) => {
        triggerDOMContentLoaded = fn;
    });
    window.addEventListener = jest.fn((type, fn) => {
        triggerWindowResize = fn;
    });

    initialiseAllContainers(containers);

    triggerDOMContentLoaded();
    triggerWindowResize();

    expect(document.querySelectorAll).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll).toHaveBeenCalledWith(container1Config.selector);
    expect(document.querySelectorAll).toHaveBeenCalledWith(container2Config.selector);

    expect(Container).toHaveBeenCalledTimes(3);
    expect(Container.mock.calls[0]).toEqual([ container1Element1, container1Config ]);
    expect(Container.mock.calls[1]).toEqual([ container1Element2, container1Config ]);
    expect(Container.mock.calls[2]).toEqual([ container2Element1, container2Config ]);

    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    expect(Container.prototype.adjust).toHaveBeenCalledTimes(6);
});

test('should not add window resize call if not required', () => {
    let triggerWindowResize = null;
    window.addEventListener = jest.fn((type, onResizeFn) => { triggerWindowResize = onResizeFn; });

    initialiseAllContainers({}, false);

    expect(triggerWindowResize).toBe(null);
});
