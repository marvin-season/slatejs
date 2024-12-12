import React, { FC } from 'react';
import { RenderElementProps } from 'slate-react';
import EditableComponent from './EditableComponent.tsx';

export const Element: FC<RenderElementProps> = props => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'input':
      return <EditableComponent {...props} />;
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