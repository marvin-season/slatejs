import { ReactEditor } from 'slate-react';

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: { type: string; children: any[] };
    Text: { text: string; bold?: boolean };
  }
}
