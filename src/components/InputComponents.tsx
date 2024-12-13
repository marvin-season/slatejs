import { FC, useState } from 'react';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';

const InputComponents: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const [value, setValue] = useState(element.value);
  const editor = useSlateStatic();
  return <>
    <span {...attributes} contentEditable={false}>
      <input
        style={{
          border: '1px solid black',
          borderRadius: '8px',
          padding: '4px'
        }}
        value={value}
        placeholder={element.placeholder} onChange={(e) => {
        const v = e.target.value;
        setValue(v);
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(editor, {
          value: v,
        }, {
          at: path,
        });
      }} />
    </span>
  </>;
};

export default InputComponents;
