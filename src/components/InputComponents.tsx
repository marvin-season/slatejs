import { FC, useState, ChangeEvent } from 'react';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';

interface InputComponentElement {
  type: string;
  value: string;
  placeholder: string;
  children: any[];
}

const InputComponents: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const typedElement = element as unknown as InputComponentElement;
  const [value, setValue] = useState(typedElement.value);
  const editor = useSlateStatic();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { value: newValue },
      { at: path }
    );
  };

  return (
    <span
      {...attributes}
      contentEditable={false}
      className="inline-block mx-0.5"
    >
      <input
        className="border-2 border-gray-200 rounded-md px-2 py-1 text-sm leading-relaxed text-gray-700 bg-gray-50 
                   transition-all duration-200 outline-none min-w-[120px]
                   placeholder:text-gray-400
                   hover:border-gray-300
                   focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        value={value}
        placeholder={typedElement.placeholder}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
      />
      {children}
    </span>
  );
};

export default InputComponents;
