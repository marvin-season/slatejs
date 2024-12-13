import { Editor, Transforms, Text } from 'slate';
import { ReactEditor } from 'slate-react';

export const toggleBoldMark = (editor: ReactEditor) => {
  const isActive = isMarkActive(editor, 'bold');
  Transforms.setNodes(
    editor,
    { bold: !isActive },
    { match: n => Text.isText(n), split: true }
  );
};

export const toggleItalicMark = (editor: ReactEditor) => {
  const isActive = isMarkActive(editor, 'italic');
  Transforms.setNodes(
    editor,
    { italic: !isActive },
    { match: n => Text.isText(n), split: true }
  );
};

export const toggleUnderlineMark = (editor: ReactEditor) => {
  const isActive = isMarkActive(editor, 'underline');
  Transforms.setNodes(
    editor,
    { underline: !isActive },
    { match: n => Text.isText(n), split: true }
  );
};

export const toggleStrikethroughMark = (editor: ReactEditor) => {
  const isActive = isMarkActive(editor, 'strikethrough');
  Transforms.setNodes(
    editor,
    { strikethrough: !isActive },
    { match: n => Text.isText(n), split: true }
  );
};

export const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
