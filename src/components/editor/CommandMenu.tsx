import React, { useState, useEffect } from 'react';
import { Range, Editor, Transforms, Element } from 'slate';
import { ReactEditor } from 'slate-react';

interface CommandMenuProps {
  editor: ReactEditor;
  targetRange: Range | null;
  onClose: () => void;
}

interface Command {
  title: string;
  icon: string;
  action: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  editor,
  targetRange,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!targetRange) return null;

  const domRange = ReactEditor.toDOMRange(editor, targetRange);
  const rect = domRange.getBoundingClientRect();
  const editorRect = ReactEditor.toDOMNode(editor, editor).getBoundingClientRect();

  const top = rect.bottom - editorRect.top;
  const left = rect.left - editorRect.left;

  const commands: Command[] = [
    {
      title: 'Text',
      icon: '📝',
      action: () => {
        Transforms.select(editor, targetRange);
        Transforms.delete(editor);
        Transforms.insertNodes(editor, {
          type: 'paragraph',
          children: [{ text: '' }],
        });
        onClose();
      },
    },
    {
      title: 'Input Field',
      icon: '📋',
      action: () => {
        Transforms.select(editor, targetRange);
        Transforms.delete(editor);
        Transforms.insertNodes(editor, {
          type: 'input',
          value: '',
          placeholder: 'Enter value...',
          children: [{ text: '' }],
        });
        onClose();
      },
    },
    {
      title: 'Heading 1',
      icon: 'H1',
      action: () => {
        Transforms.select(editor, targetRange);
        Transforms.delete(editor);
        Transforms.insertNodes(editor, {
          type: 'heading-one',
          children: [{ text: '' }],
        });
        onClose();
      },
    },
    {
      title: 'Heading 2',
      icon: 'H2',
      action: () => {
        Transforms.select(editor, targetRange);
        Transforms.delete(editor);
        Transforms.insertNodes(editor, {
          type: 'heading-two',
          children: [{ text: '' }],
        });
        onClose();
      },
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((current) => 
          current === commands.length - 1 ? 0 : current + 1
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((current) => 
          current === 0 ? commands.length - 1 : current - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        commands[selectedIndex].action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commands, selectedIndex]);

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg p-1 min-w-[180px]"
      style={{
        top: `${top + window.scrollY}px`,
        left: `${left}px`,
      }}
      onMouseDown={e => e.preventDefault()}
    >
      {commands.map((command, i) => (
        <div
          key={i}
          onClick={command.action}
          className={`p-2 flex items-center gap-2 cursor-pointer rounded text-sm text-gray-600 transition-colors
                     ${i === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <span className={`w-6 h-6 flex items-center justify-center rounded
                          ${i === selectedIndex ? 'bg-gray-200' : 'bg-gray-50'}
                          ${command.icon.length > 2 ? 'text-xs' : 'text-base'}
                          transition-colors`}>
            {command.icon}
          </span>
          {command.title}
        </div>
      ))}
    </div>
  );
};
