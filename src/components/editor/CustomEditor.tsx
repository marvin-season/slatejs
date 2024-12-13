import React from 'react';
import { Editable } from 'slate-react';
import { Range } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { Leaf } from './Leaf';
import { Element } from '../index';
import { toggleBoldMark, toggleItalicMark } from './EditorCommands';
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
    <Editable
      style={{ height: '100px', overflow: 'hidden', padding: '10px' }}
      renderElement={props => <Element {...props} />}
      renderLeaf={props => <Leaf {...props} />}
      placeholder="Enter some text..."
      onKeyDown={onKeyDown}
      onContextMenu={onContextMenu}
    />
  );
};
