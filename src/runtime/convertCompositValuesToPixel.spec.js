import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';
import convertCompositValuesToPixel from './convertCompositValuesToPixel';

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
