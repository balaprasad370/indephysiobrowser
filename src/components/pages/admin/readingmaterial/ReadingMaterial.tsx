// import React from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// export default function ReadingMaterial() {
//   return (
//     <Editor
//       apiKey='uozi2uve3iph2jxymlnlxgvfvh0dlfini8lme8h3qyidebpl'
//       init={{
//         plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
//         toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
//         tinycomments_mode: 'embedded',
//         tinycomments_author: 'Author name',
//         mergetags_list: [
//           { value: 'First.Name', title: 'First Name' },
//           { value: 'Email', title: 'Email' },
//         ],
//         branding: false,
//         elementpath : false
//       }}
//       branding={false}
//       initialValue="Welcome to indephysio reading material!"
//     />
//   );
// }



// // Importing helper modules
// import { useCallback, useMemo, useRef, useState } from "react";

// // Importing core components
// import QuillEditor from "react-quill";

// // Importing styles
// import "react-quill/dist/quill.snow.css";
// // import styles from "./styles.module.css";

// const Editor = () => {
//   // Editor state
//   const [value, setValue] = useState("");

//   // Editor ref
//   const quill = useRef();

//   // Handler to handle button clicked
//   function handler() {
//     console.log(value);
//   }

//   const imageHandler = useCallback(() => {
//     // Create an input element of type 'file'
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     // When a file is selected
//     input.onchange = () => {
//       const file = input.files[0];
//       const reader = new FileReader();

//       // Read the selected file as a data URL
//       reader.onload = () => {
//         const imageUrl = reader.result;
//         const quillEditor = quill.current.getEditor();

//         // Get the current selection range and insert the image at that index
//         const range = quillEditor.getSelection(true);
//         quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
//       };

//       reader.readAsDataURL(file);
//     };
//   }, []);

//   const modules = useMemo(
//     () => ({
//       toolbar: {
//         container: [
//           [{ header: [2, 3, 4, false] }],
//           ["bold", "italic", "underline", "blockquote"],
//           [{ color: [] }],
//           [
//             { list: "ordered" },
//             { list: "bullet" },
//             { indent: "-1" },
//             { indent: "+1" },
//           ],
//           ["link", "image","video"],
//           ["clean"],
//         ],
//         handlers: {
//           image: imageHandler,
//         },
//       },
//       clipboard: {
//         matchVisual: true,
//       },
//     }),
//     [imageHandler]
//   );

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "indent",
//     "link",
//     "image",
//     "video",
//     "color",
//     "clean",
//   ];

//   return (
//     <div className={{
        
//       }}>
//       <label className={{
//       fontWeight: 500
//   }}>Editor Content</label>
//       <QuillEditor
//         ref={(el) => (quill.current = el)}
//         // className={styles.editor}
//         theme="snow"
//         value={value}
//         formats={formats}
//         modules={modules}
//         onChange={(value) => setValue(value)}
//       />
//       <button onClick={handler} >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default Editor;

// src/App.js

import React from 'react';
import FroalaEditorComponent from './FroalaEditorComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Froala Editor in React</h1>
        <FroalaEditorComponent />
      </header>
    </div>
  );
}

export default App;
