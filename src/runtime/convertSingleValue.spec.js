import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
} from '../constants';
import convertSingleValue from './convertSingleValue';

test('single container value should be properly converted to px', () => {
    expect(convertSingleValue(
        { height: 100 },
        'lorem ipsum'
    )).toBe('lorem ipsum');

    expect(convertSingleValue(
        { height: 100 },
        `100${HEIGHT_UNIT}px`
    )).toBe('100px');

    expect(convertSingleValue(
        { width: 100 },
        `100${WIDTH_UNIT}px`
    )).toBe('100px');

    expect(convertSingleValue(
        { height: 20 },
        ` 50${HEIGHT_UNIT}px`
    )).toBe('10px');

    expect(convertSingleValue(
        { width: 15 },
        ` 50${WIDTH_UNIT}px`
    )).toBe('7.5px');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}px`
    )).toBe('55.5px');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}PX`
    )).toBe('55.5px');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}em`
    )).toBe('55.5em');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}rem`
    )).toBe('55.5rem');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}ch`
    )).toBe('55.5ch');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}%`
    )).toBe('55.5%');

    expect(convertSingleValue(
        { height: 100 },
        `55.5${HEIGHT_UNIT}%`
    )).toBe('55.5%');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}vw`
    )).toBe('55.5vw');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}vh`
    )).toBe('55.5vh');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}vmin`
    )).toBe('55.5vmin');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}vmax`
    )).toBe('55.5vmax');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}cm`
    )).toBe('55.5cm');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}mm`
    )).toBe('55.5mm');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}in`
    )).toBe('55.5in');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}pt`
    )).toBe('55.5pt');

    expect(convertSingleValue(
        { width: 100 },
        `55.5${WIDTH_UNIT}pc`
    )).toBe('55.5pc');

    expect(convertSingleValue(
        { width: 1000 },
        `55.5ch`
    )).toBe('55.5ch');

    expect(convertSingleValue(
        { width: 1000 },
        `55.5px`
    )).toBe('55.5px');
});
