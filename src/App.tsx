import React, { useMemo, useState } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, withReact } from 'slate-react';
import { createEditor, Descendant, Range, Transforms, Editor, Text as SlateText } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';
import { deserializeFromPlainText, serializeToPlainText } from './utils';

const str = '我是 {{ name }}, 我目前的工作是 {{work}}';

const withInlines = (editor: ReactEditor) => {
  const { isInline } = editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};

// Custom Types
declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor
    Element: { type: string; children: any[] }
    Text: { text: string; bold?: boolean }
  }
}

// Leaf component for text formatting
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  return <span {...attributes}>{children}</span>;
};

const toggleBoldMark = (editor: ReactEditor) => {
  const isActive = isMarkActive(editor, 'bold');
  Transforms.setNodes(
    editor,
    { bold: !isActive },
    { match: n => SlateText.isText(n), split: true }
  );
};

const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

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

  const onKeyDown = (event: React.KeyboardEvent) => {
    const { selection } = editor;

    // Handle Ctrl+B for bold
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      toggleBoldMark(editor);
      return;
    }

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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const { pageX, pageY } = event;
    setContextMenu({ x: pageX, y: pageY });
  };

  return (
    <>
      <SlateReact.Slate key={JSON.stringify(value)} editor={editor} initialValue={value}>
        <Editable
          style={{ height: '100px', overflow: 'hidden', padding: '10px' }}
          renderElement={props => <Element {...props} />}
          renderLeaf={props => <Leaf {...props} />}
          placeholder="Enter some text..."
          onKeyDown={onKeyDown}
          onContextMenu={handleContextMenu}
        />
        {contextMenu && (
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <div
              style={{ cursor: 'pointer', padding: '4px 8px' }}
              onClick={() => {
                // Add your context menu actions here
                editor.insertText('Custom text');
                setContextMenu(null);
              }}
            >
              Insert Text
            </div>
            <div
              style={{ cursor: 'pointer', padding: '4px 8px' }}
              onClick={() => {
                // Add copy functionality
                const selection = editor.selection;
                if (selection) {
                  const fragment = editor.getFragment();
                  const string = fragment.map(node => Node.string(node)).join('\n');
                  navigator.clipboard.writeText(string);
                }
                setContextMenu(null);
              }}
            >
              Copy
            </div>
          </div>
        )}
      </SlateReact.Slate>
      <div style={{ display: 'flex' }}>
        <textarea style={{ height: '400px' }} value={input} onChange={(event) => {
          setInput(event.target.value);
        }} />
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
      }}>转换
      </button>
      <button onClick={() => {
        const plainText = serializeToPlainText(editor.children);
        setResult(plainText);
      }}>查看结果
      </button>
    </>
  );
};

export default InlinesExample;
