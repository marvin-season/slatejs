import React, { useMemo, useState } from 'react';
import * as SlateReact from 'slate-react';
import { withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { CustomEditor, ContextMenu, withInlines } from './components/editor';
import { deserializeFromPlainText, serializeToPlainText } from './utils';

const str = '我是 {{ name }}, 我目前的工作是 {{work}}';

const InlinesExample = () => {
  const [input, setInput] = useState(str);
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [result, setResult] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    setContextMenu({ x: pageX, y: pageY });
  };

  return (
    <>
      <SlateReact.Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
        <CustomEditor 
          editor={editor}
          onContextMenu={handleContextMenu}
        />
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
          editor={editor}
        />
      </SlateReact.Slate>

      <div style={{ display: 'flex' }}>
        <textarea 
          style={{ height: '400px' }} 
          value={input} 
          onChange={(event) => setInput(event.target.value)} 
        />
        <code style={{ height: '400px', overflowY: 'auto' }}>
          <pre>{JSON.stringify(editor.children, null, 2)}</pre>
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
      }}>转换</button>
      <button onClick={() => {
        const plainText = serializeToPlainText(editor.children);
        setResult(plainText);
      }}>查看结果</button>
    </>
  );
};

export default InlinesExample;
