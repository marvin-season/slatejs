// TypeScript users only add this code
// Import the Slate editor factory.
import {createEditor, Editor, Element, Transforms} from 'slate'
// Import the Slate components and React plugin.
import {Editable, ReactEditor, RenderElementProps, Slate, withReact} from 'slate-react'
// Import React dependencies.
import {useCallback, useState} from 'react'

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {text: '这是一个普通的段落，可以包含文字和输入框：'},
            {type: 'input', value: '初始值', children: [{text: ''}]},
            {text: ' 这里是输入框后面的文字。'},
        ],
    },
    {
        type: 'paragraph',
        children: [{text: '这是另一个段落。'}],
    },
];

const App = () => {
    const [editor] = useState(() => withReact(createEditor()))

    // Define a rendering function based on the element passed to `props`. We use
    // `useCallback` here to memoize the function for subsequent renders.
    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'input':
                return <InputElement {...props} />;
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    return (
        <Slate editor={editor} initialValue={initialValue}>
            <Editable
                renderElement={renderElement}
                onKeyDown={event => {
                    if (!event.ctrlKey) {
                        return
                    }
                    switch (event.key) {
                    }
                }}
            />
        </Slate>
    )
}
const InputElement = (props: RenderElementProps & { element: { type: 'input'; value: string } }) => {
    const {attributes, children, element} = props;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const path = ReactEditor.findPath(props.editor, element);
        Transforms.setNodes(
            props.editor,
            {value: event.target.value},
            {at: path}
        );
    };

    return (
        <span {...attributes} contentEditable={false} style={{display: 'inline-flex', alignItems: 'center'}}>
          <input
              type="text"
              value={element.value}
              onChange={handleInputChange}
              style={{
                  margin: '0 5px',
                  padding: '2px 4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: 'inherit',
              }}
          />
            {children}
    </span>
    );
};

const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
}

export default App