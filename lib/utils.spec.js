import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    convertValueToPixel,
} from './utils';

test('container values are properly converted to pixels', () => {

    // Testing height
    expect(convertValueToPixel(
        { height: 100 },
        [ 1, HEIGHT_UNIT ]
    )).toBe('100px');

    expect(convertValueToPixel(
        { height: 100 },
        [ 0.5, HEIGHT_UNIT ]
    )).toBe('50px');

    expect(convertValueToPixel(
        { height: 200 },
        [ 0.5, HEIGHT_UNIT ]
    )).toBe('100px');

    // Testing width
    expect(convertValueToPixel(
        { width: 100 },
        [ 1, WIDTH_UNIT ]
    )).toBe('100px');

    expect(convertValueToPixel(
        { width: 100 },
        [ 0.5, WIDTH_UNIT ]
    )).toBe('50px');

    expect(convertValueToPixel(
        { width: 200 },
        [ 0.5, WIDTH_UNIT ]
    )).toBe('100px');

});
