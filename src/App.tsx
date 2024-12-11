// TypeScript users only add this code
// Import the Slate editor factory.
import {createEditor} from 'slate'
// Import the Slate components and React plugin.
import {Editable, Slate, withReact} from 'slate-react'
// Import React dependencies.
import {useState} from 'react'


const initialValue = [
    {
        type: 'paragraph',
        children: [{text: 'A line of text in a paragraph.'}],
    },
]

const App = () => {
    const [editor] = useState(() => withReact(createEditor()))
    return (
        // Add the editable component inside the context.
        <Slate editor={editor} initialValue={initialValue}>
            <Editable/>
        </Slate>
    )
}

export default App