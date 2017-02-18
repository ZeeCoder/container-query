import detectContainerDefinition from './detectContainerDefinition';
import Node from "../../__mocks__/Node";

test('Container definition should be detected anywhere inside the rule', () => {
    const ruleNode = new Node({
        selector: '.container',
    })
        .addNode( new Node({ type: 'atrule', name: 'something' }) )
        .addNode( new Node({ type: 'decl' }) )
        .addNode( new Node({ type: 'comment' }) )
        .addNode( new Node({ type: 'decl' }) )
        .addNode( new Node({ type: 'atrule', name: 'define-container' }) )
        .addNode( new Node({ type: 'decl' }) )
    ;

    expect(detectContainerDefinition(ruleNode)).toBe('.container');
});

test('Return null if no container definition was found', () => {
    const ruleNode = new Node({
        selector: '.container',
    })
        .addNode( new Node({ type: 'decl' }) )
        .addNode( new Node({ type: 'atrule', name: 'something' }) )
        .addNode( new Node({ type: 'decl' }) )
    ;

    expect(detectContainerDefinition(ruleNode)).toBeNull();
});
