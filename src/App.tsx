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
    <div style={{
      backgroundColor: '#f7fafc',
      minHeight: '100vh',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
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

        <div style={{ 
          display: 'flex',
          gap: '20px',
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '10px', color: '#4a5568' }}>Input Template</h3>
            <textarea 
              style={{ 
                width: '100%',
                height: '200px',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
              }} 
              value={input} 
              onChange={(event) => setInput(event.target.value)} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '10px', color: '#4a5568' }}>Editor State</h3>
            <code style={{ 
              display: 'block',
              height: '200px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '14px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              <pre>{JSON.stringify(editor.children, null, 2)}</pre>
            </code>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '10px', color: '#4a5568' }}>Result</h3>
            <code style={{ 
              display: 'block',
              height: '200px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '14px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              <pre>{result}</pre>
            </code>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
          justifyContent: 'center',
        }}>
          <button 
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
            style={{
              padding: '8px 16px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              ':hover': {
                backgroundColor: '#3182ce',
              }
            }}
          >
            转换
          </button>
          <button 
            onClick={() => {
              const plainText = serializeToPlainText(editor.children);
              setResult(plainText);
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              ':hover': {
                backgroundColor: '#38a169',
              }
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
