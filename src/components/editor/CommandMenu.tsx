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
      style={{
        position: 'absolute',
        zIndex: 1000,
        top: `${top + window.scrollY}px`,
        left: `${left}px`,
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '4px',
        minWidth: '180px',
      }}
      onMouseDown={e => e.preventDefault()}
    >
      {commands.map((command, i) => (
        <div
          key={i}
          onClick={command.action}
          style={{
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#4a5568',
            backgroundColor: i === selectedIndex ? '#edf2f7' : 'transparent',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: '#f7fafc',
            },
          }}
          onMouseEnter={() => setSelectedIndex(i)}
        >
          <span style={{ 
            width: '24px', 
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: i === selectedIndex ? '#e2e8f0' : '#f7fafc',
            borderRadius: '4px',
            fontSize: command.icon.length > 2 ? '12px' : '16px',
            transition: 'all 0.2s',
          }}>
            {command.icon}
          </span>
          {command.title}
        </div>
      ))}
    </div>
  );
};
