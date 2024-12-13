import React, { useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, withReact } from 'slate-react';
import { createEditor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';
import { serializeToPlainText } from './utils';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: ', and here is a more unusual inline: an ',
      },
      {
        type: 'input',
        placeholder: 'placeholder',
        value: 'hello',
        children: [
          { text: '' },
        ],
      },
      {
        text: '! Here is a read-only inline: ',
      },
    ],
  },
];

const withInlines = (editor: ReactEditor) => {
  const { isInline, isElementReadOnly } =
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

  const onKeyDown = event => {
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
