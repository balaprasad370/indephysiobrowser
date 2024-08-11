import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

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

const ContentDataReading = ({ id }) => {
  const [readingText, setReadingText] = useState("");
  const [title, setTitle] = useState("");

  const [readingId, setreadingId] = useState("");
  const editorRef = useRef(null);
  const idRef = useRef(null);

  const [token, settoken] = useState(localStorage.getItem("token"));

  const [textContent, settextContent] = useState("");
  const [open, setOpen] = useState(false);
  const [prompt, setprompt] = useState("");
  const side = "left";

  const [firstRender, setfirstRender] = useState(true);

  const [loading, setloading] = useState(false);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    getReadingMaterial(getToken);
  }, [id]);

  // const removeEditorWarning = () => {
  //   setTimeout(() => {
  //     try {
  //       const fr = document.querySelector(".fr-wrapper");
  //       if (fr && fr.firstChild && fr.firstChild.children[0].tagName == "A") {
  //         fr.firstChild.remove();
  //       }

  //       const frSecond = document.querySelector(".fr-second-toolbar");
  //       if (
  //         frSecond &&
  //         frSecond.firstChild &&
  //         frSecond.firstChild.tagName === "A"
  //       ) {
  //         frSecond.firstChild.remove();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }, 50); // Adjust the delay as needed
  // };

  const getReadingMaterial = async (getToken) => {
    setloading(true);
    try {
      const res = await axios({
        method: "post",
        data: { read_id: id },
        url: "https://server.indephysio.com/reading",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken
        }
      });

      setTitle(res.data.title);
      // console.log(id);
      // setTimeout(() => {
      //   if (editorRef.current) {
      //     const editor = editorRef.current.editor;
      //     editor.html.set(res.data.reading_text);
      //   }
      // }, 0);
      handleModelChange(res.data.reading_text);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const handleModelChange = (model) => {
    setReadingText(model);
    idRef.current = id;
  };

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await axios.post(
        "https://server.indephysio.com/upload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const imageLink =
        "https://server.indephysio.com/" + response.data.filepath;

      if (response.data.filepath && editorRef.current) {
        const editor = editorRef.current.editor;
        editor.image.insert(imageLink, null, null, editor.image.get());
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleVideoUpload = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);

    console.log("filesdata", files);

    try {
      const response = await axios.post(
        "https://server.indephysio.com/upload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const imageLink =
        "https://server.indephysio.com/" + response.data.filepath;

      if (response.data.filepath && editorRef.current) {
        const editor = editorRef.current.editor;
        editor.html.insert(
          `<span contenteditable="false" draggable="true" class="fr-video fr-dvb fr-draggable fr-active"><video src="${imageLink}" style="width: 545px; height: 338px;" controls="" class="fr-draggable">Your browser does not support HTML5 video.</video></span>`
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleFileUpload = async (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);

    console.log(files[0]);

    const fileName = files[0]["name"];

    try {
      const response = await axios.post(
        "https://server.indephysio.com/upload/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const imageLink =
        "https://server.indephysio.com/" + response.data.filepath;

      if (response.data.filepath && editorRef.current) {
        const editor = editorRef.current.editor;
        editor.file.insert(imageLink, fileName, {
          link: imageLink
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateContent = async (textToUpdate) => {
    console.log(idRef.current, " ", textToUpdate);

    const obj = {
      read_id: idRef.current,
      text: textToUpdate
    };

    try {
      const res = axios({
        method: "post",
        data: obj,
        url: "https://server.indephysio.com/reading/update",
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
    // console.log(prompt);

    setloading(true);

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/reading/generate",
      data: {
        text: prompt
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    if (res.data.status) {
      const editor = editorRef.current.editor;
      editor.html.insert(res.data.content);
    }
    setloading(false);

    // handleUpdateContent();
    setOpen(false);
    console.log(res.data);
  };

  return (
    <div className="w-full p-2">
      <div className="flex justify-between items-center my-2">
        <div className="text-start">
          <h1 className="text-black dark:text-white">
            {title}
          </h1>
        </div>
        <div>
          <button onClick={setOpen} className="p-2 bg-teal-600 text-white">
            Generate
          </button>
        </div>
      </div>
      {!loading && (
        <FroalaEditor
          ref={editorRef}
          tag="textarea"
          config={{
            attribution: false,
            toolbarSticky: true,
            imageUploadRemoteUrls: false,
            immediateReactModelUpdate: true,
            language: "es",
            videoInsertButtons: [
              "videoBack",
              "|",
              "videoUpload",
              "videoByURL",
              "videoEmbed"
            ],
            imageInsertButtons: ["imageBack", "|", "imageUpload", "imageByURL"],
            toolbarButtons: [
              "bold",
              "italic",
              "undo",
              "html",
              "redo",
              "textColor",
              "backgroundColor",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              "fontFamily",
              "fontSize",
              "color",
              "inlineStyle",
              "paragraphStyle",
              "paragraphFormat",
              "align",
              "formatOL",
              "formatUL",
              "outdent",
              "indent",
              "quote",
              "insertLink",
              "insertImage",
              "insertVideo",
              "insertFile",
              "insertTable",
              "emoticons",
              "specialCharacters",
              "insertHR",
              "selectAll",
              "clearFormatting",
              "print"
            ],
            events: {
              initialized: function (e, editor) {
                // editor.edit.off();
                console.log(loading);

                if (loading) this.edit.off();
                // else this.edit.on();
              },
              "image.beforeUpload": (files) => {
                const link = handleImageUpload(files);

                return false; // Prevent default behavior
              },
              "video.beforeUpload": (files) => {
                const link = handleVideoUpload(files);

                return false; // Prevent defaul t behavior
              },
              "file.beforeUpload": function (files) {
                const link = handleFileUpload(files);
                return false;
              },
              contentChanged: function (data) {
                const content = this.html.get();
                handleUpdateContent(content);
              }
            }
          }}
          model={readingText}
          onModelChange={handleModelChange}
        />
      )}

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
