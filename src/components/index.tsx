import React, { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import InputComponents from './InputComponents.tsx';

interface CustomElement {
  type: string;
  children: any[];
}

export const Element: FC<RenderElementProps> = props => {
  const { attributes, children, element } = props;
  const customElement = element as CustomElement;

  switch (customElement.type) {
    case 'input':
      return <InputComponents {...props} />;
    case 'heading-one':
      return <h1 {...attributes} style={{ fontSize: '2em', marginBottom: '0.5em' }}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} style={{ fontSize: '1.5em', marginBottom: '0.5em' }}>{children}</h2>;
    case 'paragraph':
      return <p {...attributes} style={{ marginBottom: '1em' }}>{children}</p>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export const Text: FC<RenderElementProps> = props => {
  const { attributes, children, leaf } = props;
  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      style={{
        paddingLeft: '0.1px',
      }}
      {...attributes}
    >
      {children}
    </span>
  );
};