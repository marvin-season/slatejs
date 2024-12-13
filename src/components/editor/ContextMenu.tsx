import React from 'react';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  editor: ReactEditor;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, editor }) => {
  if (!position) return null;

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
        style={{ cursor: 'pointer', padding: '4px 8px' }}
        onClick={() => {
          editor.insertText('Custom text');
          onClose();
        }}
      >
        Insert Text
      </div>
      <div
        style={{ cursor: 'pointer', padding: '4px 8px' }}
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
