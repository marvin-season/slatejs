import React, { useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, withReact } from 'slate-react';
import { createEditor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';
import { deserializeFromPlainText, serializeToPlainText } from './utils';

const str = '我是 {{ name }}, 我目前的工作是 {{work}}';
let nodes = deserializeFromPlainText(str);
console.log(nodes);
const initialValue = [
  {
    type: 'paragraph',
    children: nodes
  }
];

const withInlines = (editor: ReactEditor) => {
  const { isInline } =
    editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};


const InlinesExample = () => {
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  const onKeyDown = (event: any) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
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
    <>
      <button onClick={() => {
        const plainText = serializeToPlainText(editor.children);
        console.log(plainText);
      }}>查看结果
      </button>
      <SlateReact.Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderElement={props => <Element {...props} />}
          renderLeaf={props => <Text {...props} />}
          placeholder="Enter some text..."
          onKeyDown={onKeyDown}

        />
      </SlateReact.Slate>
    </>

  );
};

export default InlinesExample;
