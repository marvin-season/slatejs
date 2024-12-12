import React, {useMemo} from 'react'
import {isKeyHotkey} from 'is-hotkey'
import {css} from '@emotion/css'
import * as SlateReact from 'slate-react'
import {Editable, withReact} from 'slate-react'
import {createEditor, Editor, Range, Transforms} from 'slate'
import {withHistory} from 'slate-history'

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
                type: 'button',
                children: [
                    {text: 'editable'},
                ],
            },
            {
                text: '! Here is a read-only inline: ',
            },
        ],
    },
]
const InlinesExample = () => {
    const editor = useMemo(
        () => withInlines(withHistory(withReact(createEditor()))),
        []
    )
    const onKeyDown = event => {
        const {selection} = editor;

        // Default left/right behavior is unit:'character'.
        // This fails to distinguish between two cursor positions, such as
        // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
        // Here we modify the behavior to unit:'offset'.
        // This lets the user step into and out of the inline without stepping over characters.
        // You may wish to customize this further to only use unit:'offset' in specific cases.
        if (selection && Range.isCollapsed(selection)) {
            const { nativeEvent } = event
            if (isKeyHotkey('left', nativeEvent)) {
                console.log("left", nativeEvent)
                event.preventDefault()
                Transforms.move(editor, {unit: 'offset', reverse: true})
                return
            }
            if (isKeyHotkey('right', nativeEvent)) {
                event.preventDefault()
                Transforms.move(editor, {unit: 'offset'})
                return
            }
        }
    }
    return (
        <SlateReact.Slate editor={editor} initialValue={initialValue}>
            <Editable
                renderElement={props => <Element {...props} />}
                renderLeaf={props => <Text {...props} />}
                placeholder="Enter some text..."
                onKeyDown={onKeyDown}
            />
        </SlateReact.Slate>
    )
}
const withInlines = editor => {
    const {insertData, insertText, isInline, isElementReadOnly, isSelectable} =
        editor
    editor.isInline = element =>
        ['button'].includes(element.type) || isInline(element)
    return editor
}

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
)
const EditableButtonComponent = ({attributes, children}) => {
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
            onClick={ev => ev.preventDefault()}
            // Margin is necessary to clearly show the cursor adjacent to the button
            className={css`
                margin: 0 0.1em;

                background-color: #efefef;
                padding: 2px 6px;
                border: 1px solid #767676;
                border-radius: 2px;
                font-size: 0.9em;
            `}
        >
      <InlineChromiumBugfix/>
            {children}
            <InlineChromiumBugfix/>
    </span>
    )
}
const Element = props => {
    const {attributes, children, element} = props
    switch (element.type) {
        case 'button':
            return <EditableButtonComponent {...props} />
        default:
            return <p {...attributes}>{children}</p>
    }
}
const Text = props => {
    const {attributes, children, leaf} = props
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
    )
}
export default InlinesExample
