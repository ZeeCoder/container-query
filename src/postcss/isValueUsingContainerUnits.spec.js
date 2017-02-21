import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';
import isValueUsingContainerUnits from './isValueUsingContainerUnits';

test('should report false for non-strings and string not containing container units', () => {
    expect(isValueUsingContainerUnits(null)).toBe(false);
    expect(isValueUsingContainerUnits({})).toBe(false);
    expect(isValueUsingContainerUnits([])).toBe(false);
    expect(isValueUsingContainerUnits('')).toBe(false);
    expect(isValueUsingContainerUnits('12px 23px 33ch')).toBe(false);
    expect(isValueUsingContainerUnits('12ch 23vw 33%')).toBe(false);
});

test('should report true for values using either or both container units', () => {
    expect(isValueUsingContainerUnits(`42${HEIGHT_UNIT}px`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${WIDTH_UNIT}px`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${WIDTH_UNIT}px 42${HEIGHT_UNIT}px 42${WIDTH_UNIT}px`)).toBe(true);
});
