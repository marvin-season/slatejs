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

export const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
