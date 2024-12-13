import React, { useState, useCallback, useEffect } from 'react';
import { Editable } from 'slate-react';
import { Range, Editor, Point } from 'slate';
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
import { CommandMenu } from './CommandMenu';

interface CustomEditorProps {
  editor: ReactEditor;
  onContextMenu: (event: React.MouseEvent) => void;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({ editor, onContextMenu }) => {
  const [targetRange, setTargetRange] = useState<Range | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === '/' && !event.shiftKey) {
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        event.preventDefault();
        setTargetRange(selection);
        return;
      }
    }

    // Handle shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'b': {
          event.preventDefault();
          toggleBoldMark(editor);
          return;
        }
        case 'i': {
          event.preventDefault();
          toggleItalicMark(editor);
          return;
        }
        case 'u': {
          event.preventDefault();
          toggleUnderlineMark(editor);
          return;
        }
        case 'd': {
          event.preventDefault();
          toggleStrikethroughMark(editor);
          return;
        }
      }
    }

    // Handle Escape
    if (event.key === 'Escape' && targetRange) {
      event.preventDefault();
      setTargetRange(null);
      return;
    }

    // Handle arrow keys
    if (event.selection && Range.isCollapsed(event.selection)) {
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

  const handleDOMBeforeInput = useCallback((e: InputEvent) => {
    queueMicrotask(() => {
      const pendingDiffs = ReactEditor.androidPendingDiffs(editor);
      const scheduleFlush = pendingDiffs?.some(
        ({ diff, path }) => diff.text === '/' && diff.start === 0
      );

      if (scheduleFlush) {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
          setTargetRange(selection);
        }
      }
    });
  }, [editor]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (targetRange && !e.defaultPrevented) {
        setTargetRange(null);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [targetRange]);

  return (
    <div className="editor-container" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px 40px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',
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
        onKeyDown={handleKeyDown}
        onDOMBeforeInput={handleDOMBeforeInput}
        onContextMenu={onContextMenu}
      />
      {targetRange && (
        <CommandMenu
          editor={editor}
          targetRange={targetRange}
          onClose={() => setTargetRange(null)}
        />
      )}
    </div>
  );
};
