import React, { useEffect, useRef } from 'react';
import { ReactEditor } from 'slate-react';
import { Editor } from 'slate';
import { 
  toggleBoldMark, 
  toggleItalicMark, 
  toggleUnderlineMark, 
  toggleStrikethroughMark, 
  isMarkActive 
} from './EditorCommands';

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  editor: ReactEditor;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, editor }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  const menuItemStyle = {
    cursor: 'pointer',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#4a5568',
    transition: 'background-color 0.2s',
    borderRadius: '4px',
    margin: '2px 0',
    ':hover': {
      backgroundColor: '#edf2f7'
    }
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: '#f7fafc',
  };

  const shortcutStyle = {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#718096',
    padding: '2px 4px',
    backgroundColor: '#f7fafc',
    borderRadius: '4px',
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '4px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 1000,
        minWidth: '200px',
      }}
    >
      <div style={menuItemStyle} onClick={() => { toggleBoldMark(editor); onClose(); }}>
        <span style={iconStyle}><strong>B</strong></span>
        Bold
        {isMarkActive(editor, 'bold') && <span style={shortcutStyle}>⌘B</span>}
      </div>
      <div style={menuItemStyle} onClick={() => { toggleItalicMark(editor); onClose(); }}>
        <span style={iconStyle}><em>I</em></span>
        Italic
        {isMarkActive(editor, 'italic') && <span style={shortcutStyle}>⌘I</span>}
      </div>
      <div style={menuItemStyle} onClick={() => { toggleUnderlineMark(editor); onClose(); }}>
        <span style={iconStyle}><u>U</u></span>
        Underline
        {isMarkActive(editor, 'underline') && <span style={shortcutStyle}>⌘U</span>}
      </div>
      <div style={menuItemStyle} onClick={() => { toggleStrikethroughMark(editor); onClose(); }}>
        <span style={iconStyle}><del>S</del></span>
        Strikethrough
        {isMarkActive(editor, 'strikethrough') && <span style={shortcutStyle}>⌘D</span>}
      </div>
      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />
      <div style={menuItemStyle} onClick={() => { editor.insertText('Custom text'); onClose(); }}>
        <span style={iconStyle}>T</span>
        Insert Text
      </div>
      <div style={menuItemStyle} onClick={() => {
        const selection = editor.selection;
        if (selection) {
          const fragment = editor.getFragment();
          const string = fragment.map(node => Editor.string(editor, node)).join('\n');
          navigator.clipboard.writeText(string);
        }
        onClose();
      }}>
        <span style={iconStyle}>📋</span>
        Copy
      </div>
    </div>
  );
};
