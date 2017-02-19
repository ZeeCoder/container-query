import adjustContainer from './adjustContainer';

const container = {
    style: {},
    clientWidth: 99,
    clientHeight: 100,
    querySelectorAll: () => [ containerElement ],
};

const containerElement = {
    style: {},
};

const config = {
    selector: '.container',
    queries: [
        {
            elements: [
                {
                    selector: '.container',
                    styles: {
                        borderWidth: 'calc(10ch + 10cw)',
                    },
                },
                {
                    selector: '.container__element',
                    styles: {
                        width: '',
                        fontSize: '10ch',
                        lineHeight: '100ch',
                    },
                },
            ]
        },
        {
            conditionFunction: containerDimensions => containerDimensions.width >= 100,
            elements: [
                {
                    selector: '.container',
                    styles: {
                        borderWidth: 'calc(20ch + 20cw)',
                    },
                },
                {
                    selector: '.container__element',
                    styles: {
                        width: '50cw',
                        fontSize: '50ch',
                        lineHeight: '100ch',
                    },
                },
            ]
        },
        {
            conditionFunction: containerDimensions => (
                containerDimensions.width >= 100 &&
                containerDimensions.height >= 200
            ),
            elements: [
                {
                    selector: '.container__element',
                    styles: {
                        width: '75cw',
                        fontSize: '75ch',
                        lineHeight: '90ch',
                    },
                },
            ]
        },
    ],
};

test('The container and its elements should be properly adjusted with the defaults', () => {
    adjustContainer(container, config);

    expect(container.style).toEqual({
        borderWidth: 'calc(10px + 9.9px)',
    });
    expect(containerElement.style).toEqual({
        width: '',
        fontSize: '10px',
        lineHeight: '100px',
    });
});

describe('query styles should be applied, then removed when conditions no longer apply', () => {
    test('Apply query styles with width >= 100', () => {
        container.clientWidth = 100;

        adjustContainer(container, config);

        expect(container.style).toEqual({
            borderWidth: 'calc(20px + 20px)',
        });
        expect(containerElement.style).toEqual({
            width: '50px',
            fontSize: '50px',
            lineHeight: '100px',
        });
    });

    test('Apply query styles with height >= 200', () => {
        container.clientHeight = 200;

        adjustContainer(container, config);

        expect(container.style).toEqual({
            borderWidth: 'calc(40px + 20px)',
        });
        expect(containerElement.style).toEqual({
            width: '75px',
            fontSize: '150px',
            lineHeight: '180px',
        });
    });

    test('Remove all query styles, resetting back to the defaults', () => {
        container.clientWidth = 99;
        container.clientHeight = 99;

        adjustContainer(container, config);

        expect(container.style).toEqual({
            borderWidth: 'calc(9.9px + 9.9px)',
        });
        expect(containerElement.style).toEqual({
            width: '',
            fontSize: '9.9px',
            lineHeight: '99px',
        });
    });
});
