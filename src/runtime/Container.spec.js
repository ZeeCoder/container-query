import Container from './Container';

jest.mock('./processConfig');
jest.mock('./adjustContainer');

test('appropriate instantiation', () => {
    const processConfig = require('./processConfig').default;
    const adjustContainer = require('./adjustContainer').default;

    const containerElement = {};
    const config = {};
    const processedConfig = {};
    processConfig.mockImplementation(() => processedConfig);

    const containerInstance = new Container(containerElement, config);
    containerInstance.adjust();
    containerInstance.adjust();
    containerInstance.adjust();

    expect(processConfig).toHaveBeenCalledTimes(1);
    expect(adjustContainer).toHaveBeenCalledTimes(4);
    expect(adjustContainer.mock.calls[0][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[0][1]).toBe(processedConfig);
    expect(adjustContainer.mock.calls[1][0]).toBe(containerElement);
    expect(adjustContainer.mock.calls[1][1]).toBe(processedConfig);
});
