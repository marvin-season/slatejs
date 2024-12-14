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

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg p-1 shadow-lg z-50 min-w-[200px]"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
        onClick={() => { toggleBoldMark(editor); onClose(); }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          <strong>B</strong>
        </span>
        Bold
        {isMarkActive(editor, 'bold') && (
          <span className="ml-auto text-xs text-gray-500 px-1.5 py-0.5 bg-gray-50 rounded">
            ⌘B
          </span>
        )}
      </div>
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
        onClick={() => { toggleItalicMark(editor); onClose(); }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          <em>I</em>
        </span>
        Italic
        {isMarkActive(editor, 'italic') && (
          <span className="ml-auto text-xs text-gray-500 px-1.5 py-0.5 bg-gray-50 rounded">
            ⌘I
          </span>
        )}
      </div>
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
        onClick={() => { toggleUnderlineMark(editor); onClose(); }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          <u>U</u>
        </span>
        Underline
        {isMarkActive(editor, 'underline') && (
          <span className="ml-auto text-xs text-gray-500 px-1.5 py-0.5 bg-gray-50 rounded">
            ⌘U
          </span>
        )}
      </div>
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
        onClick={() => { toggleStrikethroughMark(editor); onClose(); }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          <span className="line-through">S</span>
        </span>
        Strikethrough
        {isMarkActive(editor, 'strikethrough') && (
          <span className="ml-auto text-xs text-gray-500 px-1.5 py-0.5 bg-gray-50 rounded">
            ⌘D
          </span>
        )}
      </div>
      <div className="h-1 bg-gray-200 my-4" />
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
        onClick={() => { editor.insertText('Custom text'); onClose(); }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          T
        </span>
        Insert Text
      </div>
      <div 
        className="cursor-pointer px-3 py-2 flex items-center gap-3 text-sm text-gray-600 transition-colors rounded hover:bg-gray-50 my-0.5"
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
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-50">
          📋
        </span>
        Copy
      </div>
    </div>
  );
};
