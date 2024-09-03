import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext
} from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../../../../ui/sheet.tsx";
import { Button } from "../../../../ui/button";
import { debounce } from "./../../../../../utils/debounce";
import { GlobalInfo } from "./../../../../../App";

const ContentDataReading = ({ id }) => {
  const [content, setContent] = useState("");
  const [range, setRange] = useState("");
  const context = useContext(GlobalInfo);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      ["link", "image", "video"],
      ["clean"]
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
  };

  const [title, setTitle] = useState("");

  const quillRef = useRef();

  const [token, settoken] = useState(localStorage.getItem("token"));

  const [open, setOpen] = useState(false);
  const [prompt, setprompt] = useState("");
  const side = "left";

  const [loading, setloading] = useState(false);

  useEffect(() => {
    getReadingMaterial();
  }, [id]);

  const getReadingMaterial = async () => {
    setloading(true);
    try {
      const res = await axios({
        method: "post",
        data: { read_id: id },
        url: context.apiEndPoint + "reading",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      setTitle(res.data.title);
      setContent(res.data.reading_text);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  // const handleImageUpload = async (files) => {
  //   const formData = new FormData();
  //   formData.append("file", files[0]);

  //   try {
  //     const response = await axios.post(
  //       context.apiEndPoint + "upload/image",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" }
  //       }
  //     );

  //     const imageLink =
  //       context.apiEndPoint + "" + response.data.filepath;

  //     if (response.data.filepath && editorRef.current) {
  //       const editor = editorRef.current.editor;
  //       editor.image.insert(imageLink, null, null, editor.image.get());
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };
  // const handleVideoUpload = async (files) => {
  //   const formData = new FormData();
  //   formData.append("file", files[0]);

  //   console.log("filesdata", files);

  //   try {
  //     const response = await axios.post(
  //       context.apiEndPoint + "upload/image",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" }
  //       }
  //     );

  //     const imageLink =
  //       context.apiEndPoint + "" + response.data.filepath;

  //     if (response.data.filepath && editorRef.current) {
  //       const editor = editorRef.current.editor;
  //       editor.html.insert(
  //         `<span contenteditable="false" draggable="true" class="fr-video fr-dvb fr-draggable fr-active"><video src="${imageLink}" style="width: 545px; height: 338px;" controls="" class="fr-draggable">Your browser does not support HTML5 video.</video></span>`
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };
  // const handleFileUpload = async (files) => {
  //   const formData = new FormData();
  //   formData.append("file", files[0]);

  //   console.log(files[0]);

  //   const fileName = files[0]["name"];

  //   try {
  //     const response = await axios.post(
  //       context.apiEndPoint + "upload/image",
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" }
  //       }
  //     );

  //     const imageLink =
  //       context.apiEndPoint + "" + response.data.filepath;

  //     if (response.data.filepath && editorRef.current) {
  //       const editor = editorRef.current.editor;
  //       editor.file.insert(imageLink, fileName, {
  //         link: imageLink
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  const handleUpdateContent = async (textToUpdate) => {
    const obj = {
      read_id: id,
      text: textToUpdate
    };

    try {
      const res = axios({
        method: "post",
        data: obj,
        url: context.apiEndPoint + "reading/update",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      // console.log("updated", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateContent = async (e) => {
    e.preventDefault();

    setloading(true);

    const res = await axios({
      method: "post",
      url: context.apiEndPoint + "reading/generate",
      data: {
        text: prompt
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    setloading(false);

    setContent(content.concat(res.data.content));

    setOpen(false);
  };

  const handleChange = useCallback(
    debounce((val) => {
      handleUpdateContent(val);
      // Perform the search or API request here
    }, 500), // Adjust delays as needed
    [id]
  );

  return (
    <div className="w-full p-2">
      <div className="flex justify-between items-center my-2">
        <div className="text-start">
          <h1 className="text-black dark:text-white  text-lg font-bold">
            {title}
          </h1>
        </div>
        <div>
          <button onClick={setOpen} className="p-2 bg-teal-600 text-white">
            Generate
          </button>
        </div>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video"
        ]}
        onSelectionChange={setRange}
        readOnly={loading ? true : false}
        placeholder="Write something amazing..."
        modules={modules}
        onChange={(val) => {
          setContent(val);
          handleChange(val);
        }}
        value={content}
      />

      <div>
        <div>
          <Sheet key={side} open={open} onOpenChange={setOpen}>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Generate content</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 text-start items-center gap-0">
                  <label htmlFor="describe" className="text-left my-3">
                    Describe
                  </label>
                  <textarea
                    id="describe"
                    rows={10}
                    defaultValue={prompt}
                    placeholder={`Write a prompt to generate the content \nEg : Generate content on German accusative prepositions`}
                    className="col-span-3 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setprompt(e.target.value);
                    }}
                  ></textarea>
                </div>

                <div>
                  {loading && <div>Content generating...{loading}</div>}
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    disabled={loading ? true : false}
                    onClick={handleGenerateContent}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Generate content
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default ContentDataReading;
