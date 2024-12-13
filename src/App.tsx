import React, { useMemo, useState } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, withReact } from 'slate-react';
import { createEditor, Descendant, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';
import { deserializeFromPlainText, serializeToPlainText } from './utils';

const str = '我是 {{ name }}, 我目前的工作是 {{work}}';

const withInlines = (editor: ReactEditor) => {
  const { isInline } =
    editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};


const InlinesExample = () => {
  const [input, setInput] = useState(str);
  const [value, setValue] = useState<Descendant[]>([]);
  const [result, setResult] = useState('');
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

      <SlateReact.Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
        <Editable
          renderElement={props => <Element {...props} />}
          renderLeaf={props => <Text {...props} />}
          placeholder="Enter some text..."
          onKeyDown={onKeyDown}

        />
      </SlateReact.Slate>


      <div style={{ display: 'flex' }}>
        <textarea value={input} onChange={(event) => {
          setInput(event.target.value);
        }} />
        <code>
          <pre>{JSON.stringify(value, null, 2)}</pre>
        </code>
        <code>
          <pre>{result}</pre>
        </code>
      </div>
      <button onClick={() => {
        try {
          setValue([
            {
              type: 'paragraph',
              children: deserializeFromPlainText(input),
            },
          ]);
        } catch (e) {
        }
      }}>转换
      </button>
      <button onClick={() => {
        const plainText = serializeToPlainText(editor.children);
        setResult(plainText);
      }}>查看修改结果
      </button>
    </>

  );
};

export default InlinesExample;
