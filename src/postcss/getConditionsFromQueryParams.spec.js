import getConditionsFromQueryParams from './getConditionsFromQueryParams';

test('single condition should work with the "<", ">", "<=", ">=" and ":" operators', () => {
    expect(getConditionsFromQueryParams('(width >= 42px)')).toEqual([
        [ 'width', '>=', 42 ],
    ]);
    expect(getConditionsFromQueryParams('(width > 42px)')).toEqual([
        [ 'width', '>', 42 ],
    ]);
    expect(getConditionsFromQueryParams('(width <= 42px)')).toEqual([
        [ 'width', '<=', 42 ],
    ]);
    expect(getConditionsFromQueryParams('(width < 42px)')).toEqual([
        [ 'width', '<', 42 ],
    ]);
    expect(getConditionsFromQueryParams('(orientation: portrait)')).toEqual([
        [ 'orientation', ':', 'portrait' ],
    ]);
    expect(getConditionsFromQueryParams('(orientation: landscape)')).toEqual([
        [ 'orientation', ':', 'landscape' ],
    ]);
});

test('should handle multiple "and" conditions', () => {
    expect(getConditionsFromQueryParams('(orientation: landscape) and (width > 42px)')).toEqual([
        [ 'orientation', ':', 'landscape' ],
        [ 'width', '>', 42 ],
    ]);
    expect(getConditionsFromQueryParams('(width < 42px) and (height >= 42px)')).toEqual([
        [ 'width', '<', 42 ],
        [ 'height', '>=', 42 ],
    ]);
});
