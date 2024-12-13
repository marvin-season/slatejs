import { FC, useState, ChangeEvent } from 'react';
import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';

interface InputComponentElement {
  type: string;
  value: string;
  placeholder: string;
  children: any[];
}

const styles = {
  container: {
    display: 'inline-block',
    margin: '0 2px',
  },
  input: {
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    transition: 'all 0.2s ease',
    outline: 'none',
    minWidth: '120px',
    '::placeholder': {
      color: '#a0aec0',
    },
    ':focus': {
      borderColor: '#4299e1',
      backgroundColor: '#fff',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)',
    },
    ':hover': {
      borderColor: '#cbd5e0',
    }
  }
};

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
      style={styles.container}
    >
      <input
        style={styles.input}
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
