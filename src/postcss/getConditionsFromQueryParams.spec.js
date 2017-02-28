import getConditionsFromQueryParams from './getConditionsFromQueryParams';

test('width condition should work with the "<", ">", "<=", ">=" and ":" operators', () => {
    expect(getConditionsFromQueryParams('(width >= 42px)')).toEqual([[
        [ 'width', '>=', 42 ],
    ]]);
    expect(getConditionsFromQueryParams('(width > 42px)')).toEqual([[
        [ 'width', '>', 42 ],
    ]]);
    expect(getConditionsFromQueryParams('(width <= 42px)')).toEqual([[
        [ 'width', '<=', 42 ],
    ]]);
    expect(getConditionsFromQueryParams('(width < 42px)')).toEqual([[
        [ 'width', '<', 42 ],
    ]]);
});

test('aspect-ratio should work with the "<", ">", "<=", ">=" and ":" operators', () => {
    expect(getConditionsFromQueryParams('(aspect-ratio >= 0.5)')).toEqual([[
        [ 'aspect-ratio', '>=', 0.5 ],
    ]]);
    expect(getConditionsFromQueryParams('(aspect-ratio > 0.5)')).toEqual([[
        [ 'aspect-ratio', '>', 0.5 ],
    ]]);
    expect(getConditionsFromQueryParams('(aspect-ratio <= 0.5)')).toEqual([[
        [ 'aspect-ratio', '<=', 0.5 ],
    ]]);
    expect(getConditionsFromQueryParams('(aspect-ratio < 0.5)')).toEqual([[
        [ 'aspect-ratio', '<', 0.5 ],
    ]]);
});

test('orientations with the : operator', () => {
    expect(getConditionsFromQueryParams('(orientation: portrait)')).toEqual([[
        [ 'orientation', ':', 'portrait' ],
    ]]);
    expect(getConditionsFromQueryParams('(orientation: landscape)')).toEqual([[
        [ 'orientation', ':', 'landscape' ],
    ]]);
});

test('should handle multiple "and" conditions', () => {
    expect(getConditionsFromQueryParams('(orientation: landscape) and (width > 42px)')).toEqual([[
        [ 'orientation', ':', 'landscape' ],
        [ 'width', '>', 42 ],
    ]]);
    expect(getConditionsFromQueryParams('(width < 42px) and (height >= 42px)')).toEqual([[
        [ 'width', '<', 42 ],
        [ 'height', '>=', 42 ],
    ]]);
});
