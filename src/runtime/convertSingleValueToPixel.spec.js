import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';
import convertSingleValueToPixel from './convertSingleValueToPixel';

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
