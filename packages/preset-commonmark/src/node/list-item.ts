import type { NodeType, NodeSpec } from 'prosemirror-model';
import type { Keymap } from 'prosemirror-commands';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { NodeParserSpec, NodeSerializerSpec } from '@milkdown/core';
import { CommonNode } from '../utility';

export class ListItem extends CommonNode {
    override readonly id = 'list_item';
    override readonly schema: NodeSpec = {
        content: 'paragraph block*',
        defining: true,
        parseDOM: [{ tag: 'li' }],
        toDOM: (node) => ['li', { class: this.getClassName(node.attrs, 'list-item') }, 0],
    };
    override readonly parser: NodeParserSpec = {
        match: ({ type }) => type === 'listItem',
        runner: (state, node, type) => {
            state.openNode(type);
            state.next(node.children);
            state.closeNode();
        },
    };
    override readonly serializer: NodeSerializerSpec = {
        match: (node) => node.type.name === this.id,
        runner: (state, node) => {
            state.openNode('listItem');
            state.next(node.content);
            state.closeNode();
        },
    };
    override readonly keymap = (type: NodeType): Keymap => ({
        Enter: splitListItem(type),
        'Mod-]': sinkListItem(type),
        'Mod-[': liftListItem(type),
    });
}
