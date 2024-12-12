import React, { FC, useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, RenderElementProps, withReact } from 'slate-react';
import { createEditor, Editor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes. Here is a ',
      },
      {
        text: ', and here is a more unusual inline: an ',
      },
      {
        type: 'input',
        children: [
          { text: 'editable' },
        ],
      },
      {
        text: '! Here is a read-only inline: ',
      },
    ],
  },
];
const InlinesExample = () => {
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );
  const onKeyDown = event => {
    const { selection } = editor;

    // Default left/right behavior is unit:'character'.
    // This fails to distinguish between two cursor positions, such as
    // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
    // Here we modify the behavior to unit:'offset'.
    // This lets the user step into and out of the inline without stepping over characters.
    // You may wish to customize this further to only use unit:'offset' in specific cases.
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      const [node] = Array.from(
        Editor.nodes(editor, { match: (n) => n.type === 'input' }),
      );

      if (node) {

      }
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset', reverse: true });
        return;
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: 'offset' });
        return;
      }
    }
  };
  return (
    <SlateReact.Slate editor={editor} onValueChange={(newValue) => {
      console.log(newValue);
    }} initialValue={initialValue}>
      <Editable
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Text {...props} />}
        placeholder="Enter some text..."
        onKeyDown={onKeyDown}

      />
    </SlateReact.Slate>
  );
};
const withInlines = (editor: ReactEditor) => {
  const { isInline, isElementReadOnly } =
    editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};

export default InlinesExample;
