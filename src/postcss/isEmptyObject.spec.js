import isEmptyObject from './isEmptyObject';

test('should return true if object is empty', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({
        val: 42,
    })).toBe(false);
});
