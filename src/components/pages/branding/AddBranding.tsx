import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { GlobalInfo } from "./../../../App";

const GridLayout = () => {
  // State to store the uploaded images
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [filePath1, setfilePath1] = useState("");
  const [filePath2, setfilePath2] = useState("");
  const [name, setname] = useState("");
  const context = useContext(GlobalInfo);

  const [file1Error, setfile1Error] = useState("");
  const [file2Error, setfile2Error] = useState("");

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const [nameError, setnameError] = useState("");
  const [token, settoken] = useState(localStorage.getItem("token"));

  // Handle the first file upload
  const handleImage1Upload = async (event) => {
    setfile1Error("");
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage1(imageUrl);
    }

    setfilePath1(await handleUploadFile(file));
  };

  // Handle the second file upload
  const handleImage2Upload = async (event) => {
    setfile2Error("");
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage2(imageUrl);
    }

    setfilePath2(await handleUploadFile(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setfile1Error("");
    setfile2Error("");
    setnameError("");

    if (filePath1 == "") {
      setfile1Error("File is required");
    }

    if (filePath2 == "") {
      setfile2Error("File is required");
    }

    if (name == "") {
      setnameError("Name is required");
    }

    if (filePath1 == "" || filePath2 == "" || name == "") {
      return;
    }

    const obj = {
      brandDemo: filePath1,
      brandCustom: filePath2,
      name: name
    };

    const response = await axios.post(
      context.apiEndPoint + "admin/branding",
      obj,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    navigator.clipboard.writeText(
      "https://portal.indephysio.com/app/branding/customize/" +
        response.data.brand_id
    );

    setfilePath1("");
    setfilePath2("");
    setname("");
    setImage1("");
    setImage2("");

    fileInputRef1.current.value = "";
    fileInputRef2.current.value = "";

    toast.success("Link copied to clipboard");
  };

  const handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      context.apiEndPoint + "upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    // console.log(response.data);
    return response.data.filepath;
  };

  return (
    <>
      <Toaster position="top-left" richColors />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {/* Grid for Image 1 */}
        <div className="border p-4">
          {image1 ? (
            <img
              src={image1}
              alt="Uploaded Image 1"
              className="w-full h-auto"
            />
          ) : (
            <p className="text-center text-gray-500">No image uploaded</p>
          )}
        </div>

        {/* Grid for Image 2 */}
        <div className="border p-4">
          {image2 ? (
            <img
              src={image2}
              alt="Uploaded Image 2"
              className="w-full h-auto"
            />
          ) : (
            <p className="text-center text-gray-500">No image uploaded</p>
          )}
        </div>

        {/* Grid for Form */}
        <div className="border p-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setnameError("");
                  setname(e.target.value);
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
              {nameError != "" && (
                <div className="text-red-600">{nameError}</div>
              )}
            </div>

            {/* First File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Example File Upload (Image 1)
              </label>
              <input
                type="file"
                ref={fileInputRef1}
                accept="image/*"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onChange={handleImage1Upload}
              />

              {file1Error != "" && (
                <div className="text-red-600">{file1Error}</div>
              )}
            </div>

            {/* Second File Upload with Copy Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload File (Image 2)
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef2}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onChange={handleImage2Upload}
              />
              {file2Error != "" && (
                <div className="text-red-600">{file2Error}</div>
              )}

              <button
                type="submit"
                className="mt-2 bg-teal-500 text-white text-sm"
              >
                Copy Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GridLayout;
