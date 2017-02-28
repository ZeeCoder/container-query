import getConditionFunction from './getConditionFunction';

test('queries separated by a comma should act as an "or"', () => {
    // When either width or height is greater than 100
    const condFn = getConditionFunction([
        [
            [ 'width', '>=', 100 ],
        ],
        [
            [ 'height', '>=', 100 ],
        ],
    ]);
    const condFn2 = getConditionFunction([
        [
            [ 'width', '>=', 100 ],
            [ 'height', '>=', 100 ],
        ],
        [
            [ 'orientation', ':', 'landscape' ],
        ],
    ]);

    expect(condFn({ width: 99, height: 99 })).toBe(false);
    expect(condFn({ width: 100, height: 99 })).toBe(true);
    expect(condFn({ width: 100, height: 100 })).toBe(true);
    expect(condFn({ width: 99, height: 100 })).toBe(true);

    expect(condFn2({ width: 100, height: 100 })).toBe(true);
    expect(condFn2({ width: 99, height: 99 })).toBe(false);
    expect(condFn2({ width: 99, height: 100 })).toBe(false);
    expect(condFn2({ width: 100, height: 20 })).toBe(true);
});

test('non array conditions should return function always returning true', () => {
    const condFn = getConditionFunction();
    const condFn2 = getConditionFunction([]);

    expect(typeof condFn).toBe('function');
    expect(condFn({ width: 0, height: 0 })).toBe(true);
    expect(condFn({ width: 99999, height: 99999 })).toBe(true);

    expect(typeof condFn2).toBe('function');
    expect(condFn2({ width: 0, height: 0 })).toBe(true);
    expect(condFn2({ width: 99999, height: 99999 })).toBe(true);
});

test('orientation conditions', () => {
    const portraitCondFn = getConditionFunction([ [ [ 'orientation', ':', 'portrait' ] ] ]);
    const landscapeCondFn = getConditionFunction([ [ [ 'orientation', ':', 'landscape' ] ] ]);

    expect(typeof portraitCondFn).toBe('function');
    // square counts as portrait according to the @media query spec, so we follow the same rule
    expect(portraitCondFn({ width: 10, height: 10 })).toBe(true);
    expect(portraitCondFn({ width: 10, height: 11 })).toBe(true);
    expect(portraitCondFn({ width: 10, height: 9 })).toBe(false);
    expect(portraitCondFn({ width: 100, height: 9 })).toBe(false);

    expect(typeof landscapeCondFn).toBe('function');
    expect(landscapeCondFn({ width: 11, height: 11 })).toBe(false);
    expect(landscapeCondFn({ width: 11, height: 10 })).toBe(true);
    expect(landscapeCondFn({ width: 100, height: 10 })).toBe(true);
    expect(landscapeCondFn({ width: 10, height: 100 })).toBe(false);
});

test('width conditions', () => {
    const ltCondFn = getConditionFunction([ [ [ 'width', '<', 100 ] ] ]);
    const lteCondFn = getConditionFunction([ [ [ 'width', '<=', 100 ] ] ]);
    const gtCondFn = getConditionFunction([ [ [ 'width', '>', 100 ] ] ]);
    const gteCondFn = getConditionFunction([ [ [ 'width', '>=', 100 ] ] ]);

    expect(typeof ltCondFn).toBe('function');
    expect(ltCondFn({ width: 10 })).toBe(true);
    expect(ltCondFn({ width: 99 })).toBe(true);
    expect(ltCondFn({ width: 100 })).toBe(false);
    expect(ltCondFn({ width: 101 })).toBe(false);
    expect(ltCondFn({ width: 200 })).toBe(false);

    expect(typeof lteCondFn).toBe('function');
    expect(lteCondFn({ width: 10 })).toBe(true);
    expect(lteCondFn({ width: 99 })).toBe(true);
    expect(lteCondFn({ width: 100 })).toBe(true);
    expect(lteCondFn({ width: 101 })).toBe(false);
    expect(lteCondFn({ width: 200 })).toBe(false);

    expect(typeof gtCondFn).toBe('function');
    expect(gtCondFn({ width: 200 })).toBe(true);
    expect(gtCondFn({ width: 101 })).toBe(true);
    expect(gtCondFn({ width: 100 })).toBe(false);
    expect(gtCondFn({ width: 99 })).toBe(false);
    expect(gtCondFn({ width: 0 })).toBe(false);

    expect(typeof gteCondFn).toBe('function');
    expect(gteCondFn({ width: 200 })).toBe(true);
    expect(gteCondFn({ width: 101 })).toBe(true);
    expect(gteCondFn({ width: 100 })).toBe(true);
    expect(gteCondFn({ width: 99 })).toBe(false);
    expect(gteCondFn({ width: 0 })).toBe(false);
});

test('height conditions', () => {
    const ltCondFn = getConditionFunction([ [ [ 'height', '<', 100 ] ] ]);
    const lteCondFn = getConditionFunction([ [ [ 'height', '<=', 100 ] ] ]);
    const gtCondFn = getConditionFunction([ [ [ 'height', '>', 100 ] ] ]);
    const gteCondFn = getConditionFunction([ [ [ 'height', '>=', 100 ] ] ]);

    expect(typeof ltCondFn).toBe('function');
    expect(ltCondFn({ height: 10 })).toBe(true);
    expect(ltCondFn({ height: 99 })).toBe(true);
    expect(ltCondFn({ height: 100 })).toBe(false);
    expect(ltCondFn({ height: 101 })).toBe(false);
    expect(ltCondFn({ height: 200 })).toBe(false);

    expect(typeof lteCondFn).toBe('function');
    expect(lteCondFn({ height: 10 })).toBe(true);
    expect(lteCondFn({ height: 99 })).toBe(true);
    expect(lteCondFn({ height: 100 })).toBe(true);
    expect(lteCondFn({ height: 101 })).toBe(false);
    expect(lteCondFn({ height: 200 })).toBe(false);

    expect(typeof gtCondFn).toBe('function');
    expect(gtCondFn({ height: 200 })).toBe(true);
    expect(gtCondFn({ height: 101 })).toBe(true);
    expect(gtCondFn({ height: 100 })).toBe(false);
    expect(gtCondFn({ height: 99 })).toBe(false);
    expect(gtCondFn({ height: 0 })).toBe(false);

    expect(typeof gteCondFn).toBe('function');
    expect(gteCondFn({ height: 200 })).toBe(true);
    expect(gteCondFn({ height: 101 })).toBe(true);
    expect(gteCondFn({ height: 100 })).toBe(true);
    expect(gteCondFn({ height: 99 })).toBe(false);
    expect(gteCondFn({ height: 0 })).toBe(false);
});

test('aspect-ratio conditions', () => {
    const ltCondFn = getConditionFunction([ [ [ 'aspect-ratio', '<', 1 ] ] ]);
    const lteCondFn = getConditionFunction([ [ [ 'aspect-ratio', '<=', 1 ] ] ]);
    const gtCondFn = getConditionFunction([ [ [ 'aspect-ratio', '>', 1 ] ] ]);
    const gteCondFn = getConditionFunction([ [ [ 'aspect-ratio', '>=', 1 ] ] ]);

    expect(typeof ltCondFn).toBe('function');
    expect(ltCondFn({ width: 10, height: 9 })).toBe(false);
    expect(ltCondFn({ width: 10, height: 10 })).toBe(false);
    expect(ltCondFn({ width: 10, height: 11 })).toBe(true);
    expect(ltCondFn({ width: 10, height: 100 })).toBe(true);

    expect(typeof lteCondFn).toBe('function');
    expect(lteCondFn({ width: 10, height: 9 })).toBe(false);
    expect(lteCondFn({ width: 10, height: 10 })).toBe(true);
    expect(lteCondFn({ width: 10, height: 11 })).toBe(true);
    expect(lteCondFn({ width: 10, height: 100 })).toBe(true);

    expect(typeof gtCondFn).toBe('function');
    expect(gtCondFn({ width: 10, height: 9 })).toBe(true);
    expect(gtCondFn({ width: 10, height: 10 })).toBe(false);
    expect(gtCondFn({ width: 10, height: 11 })).toBe(false);
    expect(gtCondFn({ width: 10, height: 100 })).toBe(false);

    expect(typeof gteCondFn).toBe('function');
    expect(gteCondFn({ width: 10, height: 9 })).toBe(true);
    expect(gteCondFn({ width: 10, height: 10 })).toBe(true);
    expect(gteCondFn({ width: 10, height: 11 })).toBe(false);
    expect(gteCondFn({ width: 10, height: 100 })).toBe(false);
});

test('multiple conditions should work', () => {
    const multiCondFn = getConditionFunction([[
        [ 'orientation', ':', 'landscape' ],
        [ 'width', '>', 100 ],
        [ 'height', '<=', 20 ],
    ]]);

    expect(typeof multiCondFn).toBe('function');
    expect(multiCondFn({ width: 100, height: 200 })).toBe(false);
    expect(multiCondFn({ width: 100, height: 50 })).toBe(false);
    expect(multiCondFn({ width: 100, height: 20 })).toBe(false);
    expect(multiCondFn({ width: 101, height: 20 })).toBe(true);
});

test('unsupported condition always returns true', () => {
    const condFn = getConditionFunction([ [ [ 'something', "that's", 'unrecognisable' ] ] ]);

    expect(typeof condFn).toBe('function');
    expect(condFn()).toBe(true);
    expect(condFn({})).toBe(true);
    expect(condFn({ width: 100, height: 100 })).toBe(true);
    expect(condFn({ width: 200, height: 100 })).toBe(true);
    expect(condFn({ width: 100, height: 200 })).toBe(true);
    expect(condFn({ width: 0, height: 0 })).toBe(true);
});
