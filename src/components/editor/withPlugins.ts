import { ReactEditor } from 'slate-react';

export const withInlines = (editor: ReactEditor) => {
  const { isInline } = editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};
