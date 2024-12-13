import React from 'react';
import { createEditor, Transforms } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to',
      },
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

            if (isKeyHotkey('ctrl', nativeEvent)) {
              console.log('ctrl');
              // 如果当前有选区，且光标在某个节点内
              if (selection) {
                // 使用 Transforms.setNodes 更新当前节点的类型或属性
                Transforms.setNodes(
                  editor,
                  { type: 'heading' }, // 设置节点的属性，例如将其改为 'heading' 类型
                  { match: (n) => n.type === 'paragraph', split: true }, // 匹配 'paragraph' 节点
                );
                event.preventDefault(); // 阻止默认行为
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}