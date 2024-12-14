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
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-7xl mx-auto">
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

        <div className="mt-10 flex gap-5 p-5 bg-white rounded-lg shadow-md">
          <div className="flex-1">
            <h3 className="mb-3 text-gray-700 font-medium">Input Template</h3>
            <textarea 
              className="w-full h-48 p-3 rounded border border-gray-200 text-sm leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              value={input} 
              onChange={(event) => setInput(event.target.value)} 
            />
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-gray-700 font-medium">Editor State</h3>
            <code className="block h-48 p-3 bg-gray-50 rounded text-sm overflow-y-auto whitespace-pre-wrap break-all">
              <pre>{JSON.stringify(editor.children, null, 2)}</pre>
            </code>
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-gray-700 font-medium">Result</h3>
            <code className="block h-48 p-3 bg-gray-50 rounded text-sm overflow-y-auto whitespace-pre-wrap break-all">
              <pre>{result}</pre>
            </code>
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              try {
                setValue([
                  {
                    type: 'paragraph',
                    children: deserializeFromPlainText(input),
                  },
                ]);
              } catch (e) {
              }
            }}
          >
            转换
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => {
              const plainText = serializeToPlainText(editor.children);
              setResult(plainText);
            }}
          >
            查看结果
          </button>
        </div>
      </div>
    </div>
  );
};

export default InlinesExample;
