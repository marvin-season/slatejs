import React from 'react';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import { toggleBoldMark, toggleItalicMark, isMarkActive } from './EditorCommands';

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  editor: ReactEditor;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, editor }) => {
  if (!position) return null;

  const menuItemStyle = {
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#f5f5f5'
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      <div
        style={menuItemStyle}
        onClick={() => {
          toggleBoldMark(editor);
          onClose();
        }}
      >
        <span style={{ fontWeight: 'bold' }}>B</span>
        Bold
        {isMarkActive(editor, 'bold') && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>⌘B</span>}
      </div>
      <div
        style={menuItemStyle}
        onClick={() => {
          toggleItalicMark(editor);
          onClose();
        }}
      >
        <span style={{ fontStyle: 'italic' }}>I</span>
        Italic
        {isMarkActive(editor, 'italic') && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>⌘I</span>}
      </div>
      <div
        style={menuItemStyle}
        onClick={() => {
          editor.insertText('Custom text');
          onClose();
        }}
      >
        Insert Text
      </div>
      <div
        style={menuItemStyle}
        onClick={() => {
          const selection = editor.selection;
          if (selection) {
            const fragment = editor.getFragment();
            const string = fragment.map(node => Editor.string(editor, node)).join('\n');
            navigator.clipboard.writeText(string);
          }
          onClose();
        }}
      >
        Copy
      </div>
    </div>
  );
};
