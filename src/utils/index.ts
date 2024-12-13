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
// 使用正则表达式匹配 {{ ... }} 的内容
  const regex = /{{\s*(\w+)\s*}}/g;

  const result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    // 将匹配到的内容之前的文本作为普通文本部分
    if (match.index > lastIndex) {
      result.push({
        text: str.slice(lastIndex, match.index),
      });
    }

    // 添加 input 元素
    result.push({
      type: 'input',
      placeholder: match[1], // 使用 {{}} 中的内容作为 placeholder
      value: '', // 或者你可以根据需要初始化 value
      children: [{ text: '' }],
    });

    // 更新 lastIndex 到当前匹配的结束位置
    lastIndex = regex.lastIndex;
  }

// 添加字符串中最后一部分的文本
  if (lastIndex < str.length) {
    result.push({
      text: str.slice(lastIndex),
    });
  }

  return result;
};

