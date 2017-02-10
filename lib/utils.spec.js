import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    convertSingleValueToPixel,
    convertCompositValuesToPixel,
    adjustValueObjectByContainerDimensions,
} from './utils';

test('single container value should be properly converted to px', () => {
    expect(convertSingleValueToPixel(
        { height: 100 },
        '100' + HEIGHT_UNIT
    )).toBe('100px');

    expect(convertSingleValueToPixel(
        { width: 100 },
        '100' + WIDTH_UNIT
    )).toBe('100px');

    expect(convertSingleValueToPixel(
        { height: 20 },
        ' 50' + HEIGHT_UNIT
    )).toBe('10px');

    expect(convertSingleValueToPixel(
        { width: 15 },
        ' 50' + WIDTH_UNIT
    )).toBe('7.5px');
});

test('composit container values are properly converted to pixels', () => {
    expect(convertCompositValuesToPixel(
        { height: 100, width: 200 },
        `1${HEIGHT_UNIT} 10${WIDTH_UNIT} 2${HEIGHT_UNIT} 5${WIDTH_UNIT}`
    )).toBe('1px 20px 2px 10px');

    expect(convertCompositValuesToPixel(
        { height: 100 },
        `10${HEIGHT_UNIT} 10${HEIGHT_UNIT} 10${HEIGHT_UNIT}`
    )).toBe('10px 10px 10px');

    expect(convertCompositValuesToPixel(
        { width: 50 },
        `20${WIDTH_UNIT} 20${WIDTH_UNIT}`
    )).toBe('10px 10px');
});

test('container value object gets all its values converted to pixels', () => {
    expect(adjustValueObjectByContainerDimensions(
        { height: 100, width: 150 },
        {
            fontSize: '50' + HEIGHT_UNIT,
            lineHeight: '100' + HEIGHT_UNIT,
            borderWidth: '50' + WIDTH_UNIT,
            padding: `10${HEIGHT_UNIT} 10${WIDTH_UNIT} 10${HEIGHT_UNIT}`,
        }
    )).toEqual({
        fontSize: '50px',
        lineHeight: '100px',
        borderWidth: '75px',
        padding: '10px 15px 10px',
    });
});
