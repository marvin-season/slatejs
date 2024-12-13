import React from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';

const initialValue = [
  {
    type: 'paragraph',
    lang: 'zh',
    children: [
      { text: 'In addition to' },
    ],
  },
  {
    type: 'paragraph',
    lang: 'zh',
    children: [
      { text: 'Got it' },
    ],
  },
];

export default function Demo() {
  const editor = withReact(createEditor());

  return (
    <div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          console.log(JSON.stringify(value, null, 2));
        }}
      >
        <Editable
          onKeyDown={(event) => {
            const { selection } = editor;
            const { nativeEvent } = event;

            if (isKeyHotkey('backspace', nativeEvent)) {
              console.log('backspace');
              // 如果当前有选区，且光标在某个节点内
              if (selection) {
                const { focus: { path, offset } } = selection;

                // 获取光标位置之前的文本
                const rawtext = Editor.string(editor, path);

                // 插入字符 '-'，不改变光标位置
                Transforms.insertText(editor, rawtext.substring(0, offset) + '-' + rawtext.substring(offset), { at: path });

                // 选择光标原来的位置，确保不移动到文本末尾
                Transforms.select(editor, {
                  anchor: { path, offset: offset + 1 }, // 保持原来的光标位置
                  focus: { path, offset: offset + 1 },
                });

                event.preventDefault(); // 阻止默认行为
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}