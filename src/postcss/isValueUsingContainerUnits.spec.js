import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../unit_constants';
import isValueUsingContainerUnits from './isValueUsingContainerUnits';

test('should report false for non-strings and string not containing container units', () => {
    expect(isValueUsingContainerUnits(null)).toBe(false);
    expect(isValueUsingContainerUnits({})).toBe(false);
    expect(isValueUsingContainerUnits([])).toBe(false);
    expect(isValueUsingContainerUnits('')).toBe(false);
    expect(isValueUsingContainerUnits('12px 23px')).toBe(false);
});

test('should report true for values using either or both container units', () => {
    expect(isValueUsingContainerUnits(`42${HEIGHT_UNIT}`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${WIDTH_UNIT}`)).toBe(true);
    expect(isValueUsingContainerUnits(`42${WIDTH_UNIT} 42${HEIGHT_UNIT} 42${WIDTH_UNIT}`)).toBe(true);
});
