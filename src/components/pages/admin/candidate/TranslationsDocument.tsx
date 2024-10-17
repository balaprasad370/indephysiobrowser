import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import Documents from "./../Documents";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { BiMessageRoundedDetail } from "react-icons/bi";
import moment from "moment";
import Chat from "./Chat";
import { io } from "socket.io-client";
import { Document, Page, pdfjs } from "react-pdf";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import PriceDealTranslation from "./PriceDealTranslation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { ClientContext } from "@/hooks/Clientcontext";
import { Switch } from "@/components/ui/switch";
const TranslationsDocument = () => {
  const context = useContext(GlobalInfo);
  const { clientDetails } = useContext(ClientContext);
  const tokenData = useAuth();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { student_id, document_category_id, document_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [url, setUrl] = useState("");
  const [documentDetails, setDocumentDetails] = useState([]);
  const [alldocuments, setAlldocuments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"top" | "right" | "bottom" | "left">(
    "bottom"
  );
  const [orderDetails, setOrderDetails] = useState([]);

  const [showFiles, setShowFiles] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // react pdf

  useEffect(() => {
    const socket11 = io(context.apiEndPoint);
    setSocket(socket11);
    socket11.emit(
      "joinGroupChat",
      "indephysio" + document_id + student_id + "room"
    );

    socket11.on("message", (message) => {
      console.log("message:", message);
      getAlldocuments();
      FetchDocuments(true);
    });
  }, []);

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  // end of react pdf

  useEffect(() => {
    FetchDocuments();
    getDocumentDetails();
    getAlldocuments();
    getOrderDetails();
  }, [document_id]);

  const getOrderDetails = async () => {
    const response = await axios.get(
      `${context.apiEndPoint}admin/candidate/get-order-details/${document_id}/${student_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    if (response.data.length > 0) {
      setOrderDetails(response.data[0]);
    } else {
      setOrderDetails([]);
    }
  };

  const FetchDocuments = async (noLoading = false) => {
    if (!noLoading) {
      setLoading(true);
    }
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/document/${student_id}/${document_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      if (response.data.length > 0) {
        setDocuments(response.data[0]);
        setUrl(response.data[0].filepath);
      } else {
        setDocuments([]);
        setUrl("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (!noLoading) {
        setLoading(false);
      }
    }
  };

  const getDocumentDetails = async () => {
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/documentData/${document_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setDocumentDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAlldocuments = async () => {
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/document/all/${student_id}/${document_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setAlldocuments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);

      handleFileUpload(file);
    }
  };

  const handleFileChangeTranslated = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);

      handleFileUploadTranslated(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${context.apiEndPoint}upload/image`,
      formData
    );
    console.log(response.data);
    setUrl(response.data.filepath);
    updateFilePath(response.data.filepath, file.name);
  };

  const handleFileUploadTranslated = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${context.apiEndPoint}upload/image`,
      formData
    );
    console.log(response.data);
    setUrl(response.data.filepath);
    setIsChecked(true);
    updateFilePathTranslated(response.data.filepath, file.name);
  };

  const updateFilePath = async (filepath: string, filename: string) => {
    try {
      const response = await axios.post(
        `${context.apiEndPoint}admin/student/translations/update/document`,
        {
          filepath: filepath,
          filename: filename,
          document_id: document_id,
          student_id: student_id,
          document_category_id: document_category_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);

      const newMessage = {
        translation_doc_id: document_id,
        student_id: student_id,
        client_id: tokenData.client_id,
        is_student: 0,
        message: filename,
        is_file: 1,
        filepath: filepath,
        message_timestamp: Date.now().toString().slice(0, -3),
        admin_first_name: tokenData.first_name,
        admin_last_name: tokenData.last_name,
        student_first_name: null,
        student_last_name: null
      };

      socket.emit("messageToGroupChatDoc", {
        roomName: "indephysio" + document_id + student_id + "room",
        message: newMessage
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateFilePathTranslated = async (
    filepath: string,
    filename: string
  ) => {
    try {
      const response = await axios.post(
        `${context.apiEndPoint}admin/student/translations/update/document/translated`,
        {
          filepath: filepath,
          filename: filename,
          document_id: document_id,
          student_id: student_id,
          document_category_id: document_category_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newMessage = {
        translation_doc_id: document_id,
        student_id: student_id,
        client_id: tokenData.client_id,
        is_student: 0,
        message: filename,
        is_file: 1,
        filepath: filepath,
        message_timestamp: Date.now().toString().slice(0, -3),
        admin_first_name: tokenData.first_name,
        admin_last_name: tokenData.last_name,
        student_first_name: null,
        student_last_name: null
      };

      socket.emit("messageToGroupChatDoc", {
        roomName: "indephysio" + document_id + student_id + "room",
        message: newMessage
      });
      getAlldocuments();

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setUrl(documents.translated_file_path);
    } else {
      setUrl(documents.filepath);
    }
    setIsChecked(!isChecked);
  };

  if (loading) {
    return (
      <div className="text-center font-bold text-black dark:text-white text-2xl mt-10 animate-bounce">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 lg:p-4 text-black dark:text-white">
      {/* Notifications  */}

   

      {url && numPages > 0 && orderDetails.net_amt > 0 && (
        <div className="px-2 lg:px-6 ">
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 flex justify-between px-4 py-2 mb-2 items-center rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              <div className="flex flex-row gap-2">
                <p>
                  Default amount :{" "}
                  <span className="font-bold pr-2">
                    € {orderDetails.net_amt}
                  </span>
                  {orderDetails.newly_adjusted_amount && (
                    <span>
                      Newly adjusted amount :{" "}
                      <span className="font-bold">
                        € {orderDetails.newly_adjusted_amount}{" "}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </span>

            <Button variant="outline" onClick={() => setOpen(true)}>
              Open
            </Button>
          </div>
        </div>
      )}
      {/* end of notifications  */}

      <div className="flex px-2 lg:px-10 justify-between items-center my-4">
        <div>
          <h1 className="text-2xl font-bold mb-4"> Document Details</h1>
        </div>

      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full px-2 lg:px-10 ">
        {/* original documeent  */}
        <div className="h-full rounded-md flex justify-center items-center w-full lg:w-1/3 ">
          <div className="w-full h-full   rounded-md min-h-[30rem] flex flex-col gap-4 justify-between items-between p-2">
            <div className="flex flex-row gap-2 items-center justify-start">
              <p className=" font-bold mb-4">
                {documentDetails.document_name && (
                  <span className="text-blue-600 pr-2">
                    {" "}
                    {documentDetails.document_name}
                  </span>
                )}
                /
                {documentDetails.document_description && (
                  <span className=" pl-2">
                    {documentDetails.document_description}
                  </span>
                )}
              </p>
            </div>

            <div className="flex py-2  gap-2 w-full justify-center items-center">
              <div>
                <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(!isChecked)}
                    className="sr-only"
                  />
                  <span className="label flex items-center text-sm font-medium text-black">
                    Original
                  </span>
                  <span
                    className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                      isChecked ? "bg-teal-600" : "bg-[#CCCCCE]"
                    }`}
                  >
                    <span
                      className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                        isChecked ? "translate-x-[28px]" : ""
                      }`}
                    ></span>
                  </span>
                  <span className="label flex items-center text-sm font-medium text-black">
                    Translated
                  </span>
                </label>
              </div>
            </div>

            {url ? (
              <div className="border border-dashed border-gray-400 rounded-md p-4 flex-1 flex justify-center flex-col items-center overflow-hidden relative">
                <Document
                  key={url}
                  className="select-none "
                  // scale={}
                  renderTextLayer={false}
                  file={context.filesServerUrl + url}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} className=" max-w-[20rem]" />
                </Document>

                <div className="w-full p-4 flex justify-center items-center z-10">
                  <button
                    className="bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer z-10 w-full"
                    onClick={() => {
                      window.open(context.filesServerUrl + url, "_blank");
                    }}
                  >
                    <HiOutlineExternalLink className="inline-block mr-2" />
                    Open
                  </button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-300">
                  Note: This is the original document that needs to be
                  translated. Change the switch to view the translated document.
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-400 rounded-md p-4 flex-1 flex justify-center flex-col items-center overflow-hidden relative">
                <p className="">No document uploaded</p>
              </div>
            )}

            <div className="flex justify-between items-center flex-wrap gap-4">
              {clientDetails.is_super_admin == 1 ? (
                <div>
                  <input
                    type="file"
                    id="upload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="upload"
                    className="bg-violet-600 text-white px-3 py-2 rounded-md cursor-pointer"
                  >
                    Upload Original Document
                  </label>
                </div>
              ) : null}

              {clientDetails.is_translator == 1 ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="uploadTranslated"
                    className="hidden"
                    accept="application/pdf"
                    disabled={!url}
                    onChange={handleFileChangeTranslated}
                  />
                  <label
                    htmlFor="uploadTranslated"
                    className={`bg-teal-600 text-white px-3 py-2 rounded-md cursor-pointer ${
                      !url ? "opacity-50  cursor-not-allowed" : ""
                    }`}
                    disabled={!url}
                  >
                    Upload Translated Document
                  </label>
                </div>
              ) : null}

              <div>
                <button
                  className="border border-teal-600 text-teal-600 px-3 py-2 rounded-md cursor-pointer hover:bg-teal-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-teal-600 disabled:cursor-not-allowed"
                  onClick={() => {
                    setOpen(true);
                  }}
                  disabled={!url}
                >
                  {clientDetails.is_translator == 1
                    ? "View Document Details"
                    : "Order Translation"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* end of original document  */}

        {/* chat and files  */}
        <div className="w-full lg:w-1/3 flex-1 h-full">
          <Chat
            student_id={student_id}
            document_id={document_id}
            setShowFiles={setShowFiles}
            showFiles={showFiles}
          />
        </div>
        {/* end of chat and files  */}

        {/* files  */}
        {showFiles && (
          <div className="w-full lg:w-1/4 h-full">
            <div className="border border-gray-300 rounded-md p-4 h-full flex flex-col gap-4">
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[35rem]">
                {alldocuments.length > 0 ? (
                  alldocuments.map((document, index) => (
                    <div key={index}>
                      <div className="text-blue-600 bg-gray-200 p-2 rounded-md text-start flex justify-between items-center ">
                        <div className="flex flex-col gap-2 w-8/12">
                          <p className="text-black text-md font-semibold  ">
                            {document.file_name}
                          </p>
                          <p className="text-black text-xs">
                            {moment(document.student_doc_modified_date).format(
                              "hh:mm:ss a , DD MMM, YYYY "
                            )}
                          </p>
                        </div>
                        <div className="w-4/12 flex items-center justify-end gap-2">
                          {/* <div className="cursor-pointer hover:text-blue-600 transition-all duration-300">
                            <BiMessageRoundedDetail size={24} />
                          </div> */}
                          <div
                            className="cursor-pointer hover:text-blue-600 transition-all duration-300"
                            onClick={() => {
                              window.open(
                                context.filesServerUrl + document.filepath,
                                "_blank"
                              );
                            }}
                          >
                            <HiOutlineExternalLink size={24} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center font-bold text-black dark:text-white text-2xl mt-10 ">
                    No documents found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* end of files  */}
      </div>

      <div>
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent
            side={side}
            className="min-h-[30rem] overflow-y-auto"
            style={{ maxHeight: "70%" }}
          >
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {documentDetails?.document_name}
              </SheetTitle>
              <SheetDescription>
                {documentDetails?.document_description}
              </SheetDescription>
            </SheetHeader>

            <div className="">
              {url && (
                <PriceDealTranslation
                  open={open}
                  setOpen={setOpen}
                  document_id={document_id}
                  student_id={student_id}
                  numPages={numPages}
                  document_category_id={document_category_id}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TranslationsDocument;
