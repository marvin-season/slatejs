import React from 'react';
import { Editable } from 'slate-react';
import { Range } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { Leaf } from './Leaf';
import { Element } from '../index';
import { 
  toggleBoldMark, 
  toggleItalicMark, 
  toggleUnderlineMark, 
  toggleStrikethroughMark 
} from './EditorCommands';
import { ReactEditor } from 'slate-react';
import { Transforms } from 'slate';

interface CustomEditorProps {
  editor: ReactEditor;
  onContextMenu: (event: React.MouseEvent) => void;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({ editor, onContextMenu }) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    const { selection } = editor;

    // Handle Ctrl+B for bold
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      toggleBoldMark(editor);
      return;
    }

    // Handle Ctrl+I for italic
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault();
      toggleItalicMark(editor);
      return;
    }

    // Handle Ctrl+U for underline
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
      toggleUnderlineMark(editor);
      return;
    }

    // Handle Ctrl+D for strikethrough (del)
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault();
      toggleStrikethroughMark(editor);
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

  return (
    <div className="editor-container" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px 40px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <Editable
        style={{
          minHeight: '300px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#2d3748',
          outline: 'none',
        }}
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
        placeholder="Type '/' for commands..."
        onKeyDown={onKeyDown}
        onContextMenu={onContextMenu}
      />
    </div>
  );
};
