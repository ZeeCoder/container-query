import saveJSON from './saveJSON';

jest.mock('fs');

test('data should be forwarded to writeFileSync', () => {
    const fs = require('fs');

    const cssFilePath = 'path/to/css/file.css';
    const json = { some: 'JSON' };

    saveJSON(cssFilePath, json);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${cssFilePath}.json`,
        JSON.stringify(json)
    );
});
