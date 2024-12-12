import { css } from '@emotion/css';
import React, { FC } from 'react';
import { RenderElementProps, useSelected, useSlate } from 'slate-react';
import { Transforms } from 'slate';

const EditableComponent: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const editor = useSlate();
  const selected = useSelected();

  const handleSelect = () => {
    Transforms.select(editor, editor.selection!);
  };

  return (
    /*
      Note that this is not a true button, but a span with button-like CSS.
      True buttons are display:inline-block, but Chrome and Safari
      have a bad bug with display:inline-block inside contenteditable:
      - https://bugs.webkit.org/show_bug.cgi?id=105898
      - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
      Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
      The only current workaround is to emulate the appearance of a display:inline button using CSS.
    */
    <span
      {...attributes}
      onClick={ev => {
        ev.preventDefault();
        handleSelect();
      }}
      // Margin is necessary to clearly show the cursor adjacent to the button
      className={css`
          margin: 0 0.1em;
          background-color: #efefef;
          padding: 2px 6px;
          border-radius: 4px;
      `}

    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  );
};


// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
        font-size: 0;
    `}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);


export default EditableComponent;