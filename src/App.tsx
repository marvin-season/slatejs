import React, { useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import * as SlateReact from 'slate-react';
import { Editable, ReactEditor, withReact } from 'slate-react';
import { createEditor, Editor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Element, Text } from './components';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: ', and here is a more unusual inline: an ',
      },
      {
        type: 'input',
        placeholder: 'placeholder',
        value: 'hello',
        children: [
          { text: '' },
        ],
      },
      {
        text: '! Here is a read-only inline: ',
      },
    ],
  },
];

// 处理按下 Backspace 键时的行为
const handleBackspace = (nativeEvent, editor) => {
  if (!editor.selection) {
    return; // 如果没有选区，返回
  }
  const { focus } = editor.selection;

  // 光标不在当前的元素开始
  if (focus.offset !== 0) {
    return;
  }

  // 获取光标所在位置的前一个节点
  const previousPath = Editor.before(editor, focus.path, { unit: 'character' });

  if (!previousPath) {
    return; // 如果前面没有内容，返回
  }

  const [previousNode] = Editor.nodes(editor, {
    at: previousPath,
    match: (n) => n.type === 'input', // 匹配 input 类型节点
  });

  if (previousNode) {
    // 如果光标位于 input 后面并且紧邻时，删除整个 input 节点
    Transforms.removeNodes(editor, { at: previousNode[1] });
    nativeEvent.preventDefault();
  }
};

const InlinesExample = () => {
  const editor = useMemo(
    () => withInlines(withHistory(withReact(createEditor()))),
    [],
  );

  const onKeyDown = event => {
    const { selection } = editor;

    // Default left/right behavior is unit:'character'.
    // This fails to distinguish between two cursor positions, such as
    // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
    // Here we modify the behavior to unit:'offset'.
    // This lets the user step into and out of the inline without stepping over characters.
    // You may wish to customize this further to only use unit:'offset' in specific cases.
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      if (isKeyHotkey('backspace', nativeEvent)) {
        handleBackspace(nativeEvent, editor);

      }
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

  return (
    <SlateReact.Slate editor={editor} onValueChange={(newValue) => {
      console.log(JSON.stringify(newValue, null, 2));
    }} initialValue={initialValue}>
      <Editable
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Text {...props} />}
        placeholder="Enter some text..."
        onKeyDown={onKeyDown}

      />
    </SlateReact.Slate>
  );
};
const withInlines = (editor: ReactEditor) => {
  const { isInline, isElementReadOnly } =
    editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  return editor;
};

export default InlinesExample;
