// src/components/FroalaEditorComponent.js

import React, { Component } from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import axios from "axios";

class FroalaEditorComponent extends Component {
  constructor() {
    super();

    this.state = {
      content: ""
    };

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  handleModelChange(model) {
    this.setState({
      content: model
    });
  }
  handleImageUpload(files) {
    console.log(files);
    const formData = new FormData();
    formData.append("file", files[0]);

    return axios
      .post("http://localhost:5000/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then((response) => {
        return response.data.link;
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }

  render() {
    return (
      <div>
        <FroalaEditor
          tag="textarea"
          config={{
            attribution: false,
            toolbarSticky: true,
            toolbarButtons: [
              "bold",
              "italic",
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
              "image.beforeUpload": (files) => {
                this.handleImageUpload(files)
                  .then((link) => {
                    if (link) {
                      const editor = this.refs.editor.editor;
                      editor.image.insert(link, null, null, editor.image.get());
                    }
                  })
                  .catch(() => {
                    const editor = this.refs.editor.editor;
                    editor.image.insert(link, null, null, editor.image.get());
                  });
                return false;
              }
            }
          }}
          model={this.state.content}
          onModelChange={this.handleModelChange}
        />
      </div>
    );
  }
}

export default FroalaEditorComponent;
