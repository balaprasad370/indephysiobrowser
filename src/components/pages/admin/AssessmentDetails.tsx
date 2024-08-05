import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditText } from "react-edit-text";
import { MdModeEditOutline } from "react-icons/md";
import axios from "axios";
import { FaUpload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Toaster, toast } from "sonner";

const AssessmentDetails = () => {
  const { id } = useParams();

  // const theme = document.getElementsByTagName("html")[0].getAttribute("class");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [question, setquestion] = useState("");





  // react pdf

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
    fetchAssessment();
  }, []);

  const fetchAssessment = async () => {
    try {
      const res = await axios({
        method: "post",
        data: {
          assess_id: id
        },
        url: `https://server.indephysio.com/assessments/details`
      });
      setquestion(res.data);
      console.log(res.data);
    } catch (error) {}
  };

  const handleFiles = async (file, data, type) => {
    console.log(data, file);

    if (file == null || file == undefined) return;
    try {
      const datasplit = data.split(",");
      const questionColumn = datasplit[0];
      const questionId = datasplit[1];
      const url = URL.createObjectURL(file); // this points to the File object we just created

      if (type == "img") {
        document.querySelector("#img" + questionId).src = url;
      } else if (type == "audio") {
        document.querySelector("#audio" + questionId).src = url;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://server.indephysio.com/upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(response.data);

      const obj = {
        assess_column: questionColumn,
        assess_id: questionId,
        assess_column_data: response.data.filepath
      };

      const res = await axios({
        method: "post",
        url: "https://server.indephysio.com/assessments/updatecolumn",
        data: obj
      });

      console.log(res.data);
      fetchAssessment();
    } catch (error) {
      console.log(error);

      //   toast.error("File not uploaded. Try again");
    }
  };

  const handleDeleteAssessDelete = async () => {
    const obj = {
      assess_column: "type",
      assess_id: id,
      assess_column_data: "Normal"
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/assessments/updateassesscolumn",
      data: obj
    });

    fetchAssessment();
    toast.success("File deleted successfully");
  };

  const handleUpdateData = async (rowdata, value) => {
    const dataexp = rowdata.split(",");

    const obj = {
      assess_column: dataexp[0],
      assess_id: dataexp[1],
      assess_column_data: value
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/assessments/updateassesscolumn",
      data: obj
    });

    console.log(res.data);
    toast.success("Question Updated successfully");
  };

  return (
    <>
      <div className="my-4 w-full px-2 text-black dark:text-white">
        <Toaster richColors position="top-right" />
        <div className="w-full py-4 my-4 flex items-start px-3 justify-start flex-col">
          <div className="w-4/5 py-4 my-4 flex items-center px-3 justify-between">
            <h1>{question?.title ? question?.title : "Untitled"}</h1>
          </div>

          <div className="w-full flex flex-row">
            <div>
              <h2 className="text-lg">Q1&#41; &nbsp;</h2>
            </div>
            <EditText
              name={"description" + "," + question?.id}
              defaultValue={question?.description}
              editButtonProps={{
                style: {
                  width: 16,
                  backgroundColor: theme == "dark" ? "#000" : "inherit",
                  color: theme == "dark" ? "#fff" : "#000"
                }
              }}
              style={{
                fontSize: "16px",
                color: theme == "dark" ? "#fff" : "#000",
                backgroundColor: theme == "dark" ? "#000" : "inherit"
              }}
              showEditButton
              editButtonContent={
                <div className="text-black dark:text-white">
                  {<MdModeEditOutline />}
                </div>
              }
              onSave={(d) => {
                console.log(d);
                handleUpdateData(d.name, d.value);
              }}
            />
          </div>
        </div>

        {question?.type?.toLowerCase() == "imagetext" && (
          <div className="w-full justify-center items-center flex">
            <div className="w-4/5 border border-dashed border-black dark:border-white min-h-[200px] rounded-md relative">
              <img
                src={"https://server.indephysio.com/" + question?.file_url}
                id={"img" + question?.id}
                className="w-full  object-contain max-h-[20rem]"
              />

              <div className="absolute bottom-2 right-0">
                <div
                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              file:text-violet-700
                              hover:file:bg-violet-100 text-white dark:text-black bg-black dark:bg-white"
                >
                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                  <input
                    type="file"
                    className="hidden"
                    id={question?.id}
                    onChange={(event) => {
                      const questionColumn = "file_url" + "," + event.target.id;
                      handleFiles(event.target.files[0], questionColumn, "img");
                    }}
                  />
                  <label
                    htmlFor={question?.id}
                    className="cursor-pointer flex flex-row items-center text-white dark:text-black bg-black dark:bg-white"
                  >
                    <FaUpload className="mr-1" />
                    Replace
                  </label>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-white z-50 p-0 ">
                <button
                  className="p-1 bg-red-600 "
                  onClick={() => {
                    handleDeleteAssessDelete();
                  }}
                >
                  Delete <br /> Document
                </button>
              </div>
            </div>
          </div>
        )}
        {question?.type?.toLowerCase() == "audiotext" && (
          <div className="w-full justify-center items-center flex">
            <div className="w-4/5 border border-dashed border-black dark:border-white min-h-[200px] rounded-md relative">
              <div className="p-4">
                <audio
                  controls
                  id={"audio" + question?.id}
                  className="w-full  object-contain max-h-[20rem]"
                >
                  <source
                    src={"https://server.indephysio.com/" + question?.file_url}
                    type="audio/mp3"
                  />
                  <source
                    src={"https://server.indephysio.com/" + question?.file_url}
                    type="audio/mpeg"
                  />
                </audio>
              </div>
              <div className="absolute bottom-2 right-0">
                <div
                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              file:text-violet-700
                              hover:file:bg-violet-100 text-white dark:text-black bg-black dark:bg-white"
                >
                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                  <input
                    type="file"
                    className="hidden"
                    id={question?.id}
                    onChange={(event) => {
                      const questionColumn = "file_url" + "," + event.target.id;
                      handleFiles(
                        event.target.files[0],
                        questionColumn,
                        "audio"
                      );
                    }}
                  />
                  <label
                    htmlFor={question?.id}
                    className="cursor-pointer flex flex-row items-center"
                  >
                    <FaUpload className="mr-1" />
                    Replace
                  </label>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-white z-50 p-0 ">
                <button
                  className="p-1 bg-red-600 "
                  onClick={() => {
                    handleDeleteAssessDelete();
                  }}
                >
                  Delete <br /> Document
                </button>
              </div>
            </div>
          </div>
        )}
        {question?.type?.toLowerCase() == "pdf" && (
          <div className="w-full justify-center items-center flex ">
            <div className="w-4/5 border border-dashed border-white min-h-[200px] rounded-md relative">
              <div className="w-full">
                <Document
                  file={"https://server.indephysio.com/" + question?.file_url}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              </div>
              <div className="absolute bottom-2 right-0 z-50">
                <div
                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                               file:text-violet-700
                              hover:file:bg-violet-100 text-white dark:text-black bg-black dark:bg-white"
                >
                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                  <input
                    type="file"
                    className="hidden"
                    id={question?.id}
                    onChange={(event) => {
                      const questionColumn = "file_url" + "," + event.target.id;
                      handleFiles(event.target.files[0], questionColumn, "pdf");
                    }}
                  />
                  <label
                    htmlFor={question?.id}
                    className="cursor-pointer flex flex-row items-center"
                  >
                    <FaUpload className="mr-1" />
                    Replace
                  </label>
                </div>
              </div>

              <div className="absolute top-0 right-0 z-50 w-[100px]">
                <div className="bg-dark dark:bg-white text-white dark:text-black flex items-center justify-between w-full">
                  <div className="w-1/3">
                    <button
                      className="p-2 focus:outline-none hover:outline-none"
                      onClick={() => {
                        if (pageNumber > 1) {
                          setPageNumber(() => pageNumber - 1);
                        }
                      }}
                    >
                      <FaChevronLeft
                        color={pageNumber > 1 ? "#000000" : "#00000030"}
                      />
                    </button>
                  </div>
                  <div className="w-1/3">
                    {pageNumber} / {numPages}
                  </div>
                  <div className="w-1/3">
                    <button
                      className="p-2 focus:outline-none hover:outline-none"
                      onClick={() => {
                        if (pageNumber < numPages) {
                          setPageNumber(() => pageNumber + 1);
                        }
                      }}
                    >
                      <FaChevronRight
                        color={pageNumber < numPages ? "#000000" : "#00000030"}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 text-white z-50 p-0 ">
                <button
                  className="p-1 bg-red-600 "
                  onClick={() => {
                    handleDeleteAssessDelete();
                  }}
                >
                  Delete <br /> Document
                </button>
              </div>
            </div>
          </div>
        )}

        {question?.type?.toLowerCase() == "normal" && (
          <div className="w-full justify-center items-center flex ">
            <div className="w-4/5 border border-dashed border-white min-h-[200px] rounded-md relative">
              <p className="text-black  dark:text-white">
                You can upload the documents (supported types: png,jpg,
                jpeg,gif, pdf,audio)
              </p>

              <div className="absolute bottom-2 right-0 z-50">
                <div
                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold file:text-violet-700
                              hover:file:bg-violet-100 text-white dark:text-black bg-black dark:bg-white"
                >
                  <input
                    type="file"
                    className="hidden"
                    id={question?.id}
                    onChange={(event) => {
                      const questionColumn = "file_url" + "," + event.target.id;
                      handleFiles(
                        event.target.files[0],
                        questionColumn,
                        "Normal"
                      );
                    }}
                  />
                  <label
                    htmlFor={question?.id}
                    className="cursor-pointer flex flex-row items-center "
                  >
                    <FaUpload className="mr-1" />
                    Replace
                  </label>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 text-white z-50 p-0 ">
                <button
                  className="p-1 bg-red-600 "
                  onClick={() => {
                    handleDeleteAssessDelete();
                  }}
                >
                  Delete <br /> Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssessmentDetails;
