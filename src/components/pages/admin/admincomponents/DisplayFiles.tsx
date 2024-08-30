import React, { useEffect, useState, useContext } from "react";
import { GlobalInfo } from "./../../../../App";
import { FaCircleCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { RiVerifiedBadgeFill, RiErrorWarningFill } from "react-icons/ri";
import { Ban } from "lucide-react";

const FileGrid = ({ files, onAccept, onReject }) => {
  const [documentType, setdocumentType] = useState("img");
  const context = useContext(GlobalInfo);

  const isImage = (fileNameSource) => {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg",
      "bmp",
      "tiff",
      "heic",
      "heif"
    ];

    // Extract the file extension
    const fileName = fileNameSource;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    return imageExtensions.includes(fileExtension);
  };

  function truncateText(text, maxLength = 20) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 min-h-[20rem] flex flex-col justify-between items-center"
          >
            <div className="text-start ">
              <div>
                {file.status == "completed" && (
                  <div className="flex flex-start items-center text-teal-600 my-2 font-bold">
                    <RiVerifiedBadgeFill size={22} />
                    <div className="pl-3">Accepted</div>
                  </div>
                )}
              </div>
              <div>
                {file.status == "pending" && (
                  <div className="flex flex-start items-center text-yellow-600 my-2 font-bold">
                    <RiErrorWarningFill size={22} />
                    <div className="pl-3">Pending</div>
                  </div>
                )}
              </div>
              <div>
                {file.status == "rejected" && (
                  <div className="flex flex-start items-center text-red-600 my-2 font-bold">
                    <Ban size={22} />
                    <div className="pl-3">Rejected</div>
                  </div>
                )}
              </div>
              {isImage(file.document_name) && (
                <div className="border border-solid border-primary">
                  <img
                    draggable="false"
                    src={context.filesServerUrl + file.document_path}
                    className="h-[200px] "
                  />
                </div>
              )}
              {!isImage(file.document_name) && (
                <div className="border border-solid border-primary">
                  <img
                    draggable="false"
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS4OmLntGjTEHOBWWXCLsu7avhG58Gzo7h9g&s"
                    }
                    className="h-[200px] "
                  />
                </div>
              )}
            </div>
            <div className="w-full">
              <div className="text-start w-full py-2">
                <span className="text-sm  mb-2">
                  {truncateText(file.document_name)}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <button
                  onClick={() => onAccept(file)}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold  rounded"
                >
                  <FaCircleCheck size={20} />
                </button>

                <button
                  onClick={() => {
                    window.open(
                      context.filesServerUrl + file.document_path,
                      "_blank"
                    );
                  }}
                  className="bg-blue-800 hover:bg-blue-600 text-white font-bold  rounded"
                >
                  <FaDownload size={20} />
                </button>
                <button
                  onClick={() => onReject(file)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold  rounded"
                >
                  <MdCancel size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
