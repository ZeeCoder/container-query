import isEmptyObject from './isEmptyObject';

test('should return true if object is empty', () => {
    expect(isEmptyObject({})).toBe(true);

    const obj = {
        val: 42,
        val2: 24,
    };

    obj.hasOwnProperty = jest.fn(() => true);

    expect(isEmptyObject(obj)).toBe(false);
    expect(obj.hasOwnProperty).toHaveBeenCalledTimes(1);
});
