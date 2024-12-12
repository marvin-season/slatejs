import { FC, useState } from 'react';
import { RenderElementProps } from 'slate-react';

const InputComponents: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const [value, setValue] = useState(element.value);

  return <>
    <span {...attributes} contentEditable={false}>
      <input value={value} placeholder={element.placeholder} onChange={(e) => {
        setValue(e.target.value);
      }} />
    </span>
  </>;
};

export default InputComponents;
