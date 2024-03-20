import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/text-text-editor.module.scss'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function MyEditor() {
   const [text, setText] = useState('');

   function handleChange(value) {
      setText(value);
      console.log(value);
   }

   const modules = {
      toolbar: [
         [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
         [{ size: [] }],
         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
         [{ 'list': 'ordered' }, { 'list': 'bullet' },
         { 'indent': '-1' }, { 'indent': '+1' }],
         ['link', 'image', 'video'],
         ['clean']
      ],
      clipboard: {
         // toggle to add extra line breaks when pasting HTML:
         matchVisual: false,
      }
   }

   return (
      <div className={styles.container}>
         <ReactQuill
            value={text}
            onChange={handleChange}
            theme={'snow'}
            placeholder="Nhap noi dung..."
            modules={modules}
         />
      </div>
   );
}

export default MyEditor;
