import { css } from '@emotion/css';
import React, { FC, useMemo } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';

const EditableComponent: FC<RenderElementProps> = ({ attributes, element, children }) => {
  const selected = useSelected();

// 判断输入框是否为空
  const isEmpty = element.children.length === 1 && element.children[0].text === '';
  const isPlaceholder = useMemo(() => {

    console.log(selected, isEmpty);
    return !selected && isEmpty;
  }, [selected, isEmpty]);

  console.log('isPlaceholder', isPlaceholder);
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
      {isPlaceholder ? children[1] : children[0]}
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