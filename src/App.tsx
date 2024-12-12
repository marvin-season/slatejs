import React, { FC, useMemo } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import { css } from '@emotion/css';
import * as SlateReact from 'slate-react';
import { Editable, RenderElementProps, withReact } from 'slate-react';
import { createEditor, Range, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import EditableComponent from './components/EditableComponent.tsx';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes. Here is a ',
      },
      {
        text: ', and here is a more unusual inline: an ',
      },
      {
        type: 'input',
        children: [
          { text: 'editable' },
        ],
      },
      {
        text: '! Here is a read-only inline: ',
      },
    ],
  },
];
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
    <SlateReact.Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Text {...props} />}
        placeholder="Enter some text..."
        onKeyDown={onKeyDown}
      />
    </SlateReact.Slate>
  );
};
const withInlines = (editor: ReturnType<typeof withHistory>) => {
  const { isInline, isElementReadOnly } =
    editor;
  editor.isInline = element =>
    ['input'].includes(element.type) || isInline(element);
  editor.isElementReadOnly = element =>
    element.type === 'input' || isElementReadOnly(element);
  return editor;
};

const Element: FC<RenderElementProps> = props => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'input':
      return <EditableComponent {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
const Text: FC<RenderElementProps> = props => {
  const { attributes, children, leaf } = props;
  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      className={
        leaf.text === ''
          ? css`
                    padding-left: 0.1px;
          `
          : null
      }
      {...attributes}
    >
      {children}
    </span>
  );
};
export default InlinesExample;
