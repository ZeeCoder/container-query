import extractContainerUnitStylesFromRule from './extractContainerUnitStylesFromRule';
import Node from "../../__mocks__/Node";
import {
    HEIGHT_UNIT,
    WIDTH_UNIT,
    DEFINE_CONTAINER_NAME,
} from "../constants";

test('should only accept rule nodes', () => {
    expect(() => {
        extractContainerUnitStylesFromRule({});
    }).toThrowError(/^`ruleNode` must be of type "rule".$/);
});

test('should throw if container units are used on a container with width or height properties', () => {
    const errorMessageRegex = /^A container cannot use container units for its width and\/or height properties.$/;

    expect(() => {
        extractContainerUnitStylesFromRule(
            new Node({
                type: 'rule',
                selector: '.container',
            })
                .addNode(new Node({
                    type: 'atrule',
                    name: DEFINE_CONTAINER_NAME,
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'width',
                    value: '42' + WIDTH_UNIT,
                }))
        );
    }).toThrowError(errorMessageRegex);

    expect(() => {
        extractContainerUnitStylesFromRule(
            new Node({
                type: 'rule',
                selector: '.container',
            })
                .addNode(new Node({
                    type: 'atrule',
                    name: DEFINE_CONTAINER_NAME,
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'height',
                    value: '42' + HEIGHT_UNIT,
                }))
        );
    }).toThrowError(errorMessageRegex);
});

test('should extract all container unit styles', () => {
    expect(
        extractContainerUnitStylesFromRule(
            new Node({
                type: 'rule',
                selector: '.container',
            })
        )
    ).toEqual({});

    expect(
        extractContainerUnitStylesFromRule(
            new Node({
                type: 'rule',
                selector: '.container',
            })
                .addNode(new Node({
                    type: 'atrule',
                    name: DEFINE_CONTAINER_NAME,
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'height',
                    value: '42px',
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'width',
                    value: '42px',
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'font-size',
                    value: '5' + HEIGHT_UNIT,
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'line-height',
                    value: '42' + WIDTH_UNIT,
                }))
                .addNode(new Node({
                    type: 'decl',
                    prop: 'border',
                    value: 'none',
                }))
        )
    ).toEqual({
        lineHeight: '42' + WIDTH_UNIT,
        fontSize: '5' + HEIGHT_UNIT,
    });
});
