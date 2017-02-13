import { detectContainerDefinition } from './postcss';

describe('detectContainerDefinition', () => {
    test('Container definition should be detected anywhere inside the rule', () => {
        const ruleNode = {
            selector: '.container',
            nodes: [
                { type: 'atrule', name: 'something' },
                { type: 'decl' },
                { type: 'comment' },
                { type: 'decl' },
                { type: 'atrule', name: 'define-container' },
                { type: 'decl' },
            ],
        };

        expect(detectContainerDefinition(ruleNode)).toBe('.container');
    });

    test('Return null if no container definition was found', () => {
        const ruleNode = {
            selector: '.container',
            nodes: [
                { type: 'decl' },
                { type: 'atrule', name: 'something' },
                { type: 'decl' },
            ],
        };

        expect(detectContainerDefinition(ruleNode)).toBeNull();
    });
});
