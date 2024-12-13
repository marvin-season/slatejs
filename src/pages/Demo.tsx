import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes. Here is a ',
      },
    ],
  },
];
export default function Demo() {

  const editor = withReact(createEditor());
  return <>
    <div>
      <Slate editor={editor} initialValue={initialValue} onValueChange={v => {
        console.log(JSON.stringify(v, null, 2));
      }}>
        <Editable />
      </Slate>

    </div>
  </>;
}