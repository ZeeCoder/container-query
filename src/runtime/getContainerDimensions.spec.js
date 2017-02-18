import getContainerDimensions from './getContainerDimensions';

test('should return an object with the expected width and height data', () => {
    const $container = {
        width: () => { return 100; },
        height: () => { return 50; },
    };

    expect(getContainerDimensions($container)).toEqual({
        width: 100,
        height: 50,
    });
});
