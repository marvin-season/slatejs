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

