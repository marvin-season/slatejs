export const serializeToPlainText = (nodes: any[]) => {
  if (nodes.length === 0) {
    return '';
  }

  let plainText = '';
  nodes.forEach((node: any) => {
    if (!node.type) {
      plainText += node.text;
    }

    if (node.type === 'input') {
      plainText += node.value;
    }

    if (node.children && node.children.length > 0) {
      plainText += serializeToPlainText(node.children);
    }
  });

  return plainText;
};

export const deserializeFromPlainText = (str: string) => {

};

// 处理按下 Backspace 键时的行为
export const handleBackspace = (nativeEvent, editor) => {
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