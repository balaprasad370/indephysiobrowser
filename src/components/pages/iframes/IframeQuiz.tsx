import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import editsvg from "../../../assets/edit.svg";
import { MdModeEditOutline } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import { BiSolidVolumeFull } from "react-icons/bi";
import { cn } from "./../../../utils/cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select.tsx";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../../ui/alert.tsx";
import { Button } from "../../ui/button";
import { GlobalInfo } from "./../../../App";

import useSpeechSynthesis from "../../../hooks/useSpeechSynthesis";
import JumbledSentences from "./components/JumbledSentences";

// document.getElementsByTagName("html")[0].setAttribute("class","dark");

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full py-2", className)}>
      {children}
    </div>
  );
};

const Quizdetails = ({ id, disableStatus }) => {
  //   const { id } = useParams();

  const context = useContext(GlobalInfo);
  const [quiz, setquiz] = useState([]);
  const [quizMetaData, setquizMetaData] = useState("");

  const [deletequestion, setdeletequestion] = useState("");
  const [questionType, setquestionType] = useState("");

  const { speak } = useSpeechSynthesis();

  const theme = document.getElementsByTagName("html")[0].getAttribute("class");
  useEffect(() => {
    fetchMetadata();
  }, [id]);

  useEffect(() => {
    // fetchQuizDetails(id);

    fetchQuizLatestDetails(id);
  }, [disableStatus, id]);

  const fetchQuizLatestDetails = async (mod_id) => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "questions/details",
        data: {
          module_id: mod_id
        }
      });

      setquiz(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchQuizDetails = async (id) => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "module/details",
        data: {
          quizId: id
        }
      });

      setquiz(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "module/quizdata",
        data: {
          quizId: id
        }
      });

      console.log(response.data);
      setquizMetaData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateData = async (updatedata, value, type = "") => {
    try {
      // console.log(value, updatedata);

      const updatedatasplit = updatedata.split(",");

      const questioncolumn = updatedatasplit[0];
      const questionId = updatedatasplit[1];

      const response = await axios({
        method: "post",
        data: {
          questionid: questionId,
          questioncolumn: questioncolumn,
          updatedvalue: value
        },
        url: context.apiEndPoint + "update-query-data"
      });

      console.log(response.data);
      if (type == "record") {
        fetchQuizLatestDetails(id);
      }
      toast.success("Successfully updated");
    } catch (e) {
      console.log(e);

      toast.error("Something went wrong!");
    }
  };

  function removeComma(str) {
    return str.replace(/,/g, "");
  }

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
        context.apiEndPoint + "upload/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(response.data);

      const obj = {
        questionColumn,
        questionId,
        filepath: response.data.filepath
      };

      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "updateColumn",
        data: obj
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);

      toast.error("File not uploaded. Try again");
    }
  };

  const handledJumbled = (elementid, contentData) => {
    const element = document.getElementById("jumbled" + elementid);
    // console.log(element);

    // const div = document.createElement("div");
    // div.innerHTML = "jvbdvbnm";
    // Create button element
    const button = document.createElement("button");

    // Set class attribute
    button.className =
      "flex items-center justify-between outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 hover:text-white";

    // Add click event listener to remove button when clicked
    button.addEventListener("click", function (e) {
      this.remove(); // 'this' refers to the button element
    });

    // Create div element for content
    const div = document.createElement("div");
    div.className = "pr-2";

    // Replace "{ele}" with actual content you want to display inside the div
    div.textContent = removeComma(contentData); // Replace "{ele}" with actual content

    // Append div to button
    button.appendChild(div);

    // Create SVG element for cancel icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M18 6L6 18M6 6l12 12");

    svg.appendChild(path);

    // Append SVG to button
    button.appendChild(svg);

    // Append button to the document body or any other parent element
    element.appendChild(button);

    updateJumbledWords(element, elementid);
  };

  const updateJumbledWords = async (element, questionId) => {
    console.log(element.children.length);
    // console.log();
    const strjumble = [];

    for (let i = 0; i < element.children.length; i++) {
      strjumble.push(element.children[i].children[0].innerHTML);
    }
    // console.log();

    const response = await axios({
      method: "post",
      data: {
        questionid: questionId,
        questioncolumn: "jumbled_question_order",
        updatedvalue: strjumble.join(",")
      },
      url: context.apiEndPoint + "update-query-data"
    });

    console.log(response.data);
  };

  const handleAddQuestion = async (value) => {
    var questiontype;

    if (value == "mcq") {
      questiontype = "Normal";
    } else if (value == "textnormal") {
      questiontype = "TextNormal";
    } else if (value == "textimage") {
      questiontype = "TextImage";
    } else if (value == "textaudio") {
      questiontype = "TextAudio";
    } else if (value == "imagemcq") {
      questiontype = "Image";
    } else if (value == "imagetext") {
      questiontype = "ImageText";
    } else if (value == "audiomcq") {
      questiontype = "Audio";
    } else if (value == "audiotext") {
      questiontype = "AudioText";
    } else if (value == "truefalse") {
      questiontype = "TrueFalse";
    } else if (value == "jumblewords") {
      questiontype = "JumbledWords";
    } else if (value == "multiquestionsnormal") {
      questiontype = "MultiQuestionsNormal";
    } else if (value == "multiquestionsimage") {
      questiontype = "MultiQuestionsImage";
    } else if (value == "multiquestionsaudio") {
      questiontype = "MultiQuestionsAudio";
    } else if (value == "record") {
      questiontype = "Record";
    } else if (value == "match") {
      questiontype = "Match";
    } else if (value == "jumbledsentences") {
      questiontype = "JumbledSentences";
    }

    const obj = {
      type: questiontype,
      moduleId: quizMetaData.id
    };

    // console.log(obj);

    const res = await axios({
      method: "post",
      data: obj,
      url: context.apiEndPoint + "module/question/add"
    });

    fetchQuizLatestDetails(id);
    // console.log(res.data);
  };

  const handleAddSubQuestion = async (value, question_id) => {
    var questiontype;

    if (value == "mcq") {
      questiontype = "Normal";
    } else if (value == "imagemcq") {
      questiontype = "Image";
    } else if (value == "textimage") {
      questiontype = "TextImage";
    } else if (value == "textaudio") {
      questiontype = "TextAudio";
    } else if (value == "textnormal") {
      questiontype = "TextNormal";
    } else if (value == "imagetext") {
      questiontype = "ImageText";
    } else if (value == "audiomcq") {
      questiontype = "Audio";
    } else if (value == "audiotext") {
      questiontype = "AudioText";
    } else if (value == "truefalse") {
      questiontype = "TrueFalse";
    } else if (value == "jumblewords") {
      questiontype = "JumbledWords";
    }

    const obj = {
      type: questiontype,
      moduleId: quizMetaData.id,
      question_id: question_id
    };

    // console.log(obj);

    try {
      const res = await axios({
        method: "post",
        data: obj,
        url: context.apiEndPoint + "module/subquestion/add"
      });

      console.log("====================================");
      console.log(res.data);
      console.log("====================================");
    } catch (error) {
      console.log("====================================");
      console.log(error, "svjsbdhfjmn");
      console.log("====================================");
    }

    fetchQuizLatestDetails(id);
  };

  const handleDeleteQuestion = async () => {
    // console.log(deletequestion);

    const res = await axios({
      method: "post",
      data: {
        questionId: deletequestion
      },
      url: context.apiEndPoint + "module/question/delete"
    });
    console.log(res.data);

    try {
      fetchQuizLatestDetails(id);
      // document.getElementById("questionid" + deletequestion).remove(this);
    } catch (error) {
      console.log(error);
    }

    toast.success("Question deleted successfully");
  };

  const handleClearModule = async () => {
    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "module/clear",
        data: {
          moduleId: id
        }
      });

      try {
        fetchQuizLatestDetails(id);
        // document.getElementById("questionid" + deletequestion).remove(this);
      } catch (error) {
        console.log(error);
      }

      toast.success("Module cleared successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="flex items-start flex-col p-4 mx-3 w-full quiz-details">
        <div className="flex justify-between items-baseline w-full">
          <div>
            <h1 className="text-black dark:text-white py-4">
              {quizMetaData.name}
            </h1>
          </div>
          <div className="flex flex-row items-center">
            <div className="mx-2">
              <AlertDialog className="relative">
                <AlertDialogTrigger asChild>
                  <button className="bg-red-600 w-[100px] text-white p-0 px-1 py-1">
                    Clear
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all questions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearModule}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <LabelInputContainer className="flex flex-row items-center justify-between ">
              {/* <Label htmlFor="firstname">Login as </Label> */}
              <Select
                className="text-black bg-white border border-black"
                value={questionType}
                onValueChange={(value) => {
                  // console.log(value);
                  handleAddQuestion(value);
                  setquestionType("");
                }}
              >
                <SelectTrigger className="w-[180px] text-black bg-white ">
                  <SelectValue placeholder="Add question" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem value="mcq" className="hover:bg-slate-200">
                    MCQ
                  </SelectItem>
                  <SelectItem value="match" className="hover:bg-slate-200">
                    Match the following
                  </SelectItem>
                  <SelectItem
                    value="jumbledsentences"
                    className="hover:bg-slate-200"
                  >
                    Jumbled sentences
                  </SelectItem>
                  <SelectItem value="textnormal" className="hover:bg-slate-200">
                    Text
                  </SelectItem>
                  <SelectItem value="textimage" className="hover:bg-slate-200">
                    Text with Image
                  </SelectItem>
                  <SelectItem value="textaudio" className="hover:bg-slate-200">
                    Text with Audio
                  </SelectItem>
                  <SelectItem value="imagemcq" className="hover:bg-slate-200">
                    Image with MCQ
                  </SelectItem>
                  <SelectItem value="record" className="hover:bg-slate-200">
                    Record
                  </SelectItem>
                  <SelectItem
                    value="multiquestionsnormal"
                    className="hover:bg-slate-200"
                  >
                    Multiple Questions Default
                  </SelectItem>
                  <SelectItem
                    value="multiquestionsimage"
                    className="hover:bg-slate-200"
                  >
                    Multiple Questions Image
                  </SelectItem>
                  <SelectItem
                    value="multiquestionsaudio"
                    className="hover:bg-slate-200"
                  >
                    Multiple Questions Audio
                  </SelectItem>
                  {/* <SelectItem value="imagetext" className="hover:bg-slate-200">
                    Image with Textbox
                  </SelectItem> */}
                  <SelectItem value="truefalse" className="hover:bg-slate-200">
                    True or False
                  </SelectItem>

                  <SelectItem value="audiomcq" className="hover:bg-slate-200">
                    Audio with MCQ
                  </SelectItem>

                  {/* <SelectItem value="audiotext" className="hover:bg-slate-200">
                    Audio with Textbox
                  </SelectItem> */}
                  <SelectItem
                    value="jumblewords"
                    className="hover:bg-slate-200"
                  >
                    Jumble Words
                  </SelectItem>
                </SelectContent>
              </Select>
            </LabelInputContainer>
          </div>
        </div>

        {quiz.length > 0 &&
          quiz.map((item, idx) => {
            return (
              <div
                id={"questionid" + item.id}
                key={idx}
                className=" w-full flex items-center justify-center my-4 relative"
              >
                <AlertDialog className="relative">
                  <AlertDialogTrigger
                    asChild
                    className="absolute right-0 top-0"
                  >
                    <Button
                      variant="outline"
                      id={"btn|" + item.id}
                      onClick={(e) => {
                        setdeletequestion(e.currentTarget.id.split("|")[1]);
                      }}
                      className="outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 dark:text-red-600 dark:hover:text-white z-50 mt-2 "
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this question.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteQuestion}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {item.type.toLowerCase() != "jumbledwords" &&
                  item.type.toLowerCase() != "multiquestionsnormal" &&
                  item.type.toLowerCase() != "multiquestionsimage" &&
                  item.type.toLowerCase() != "multiquestionsaudio" &&
                  item.type.toLowerCase() != "textnormal" &&
                  item.type.toLowerCase() != "textimage" &&
                  item.type.toLowerCase() != "textaudio" &&
                  item.type.toLowerCase() != "evaluate" &&
                  item.type.toLowerCase() != "record" &&
                  item.type.toLowerCase() != "match" &&
                  item.type.toLowerCase() != "jumbledsentences" &&
                  item.type.toLowerCase() != "speaking" && (
                    <div className="absolute right-2 bottom-1 z-50">
                      <LabelInputContainer className="flex flex-row items-center justify-between">
                        <Select
                          id={"selectanswer|" + item.id}
                          className="text-black bg-white"
                          onValueChange={(value) => {
                            let correctanswerupdatedata =
                              "correctAnswerIndex" + "," + value.split("|")[1];

                            let correctanswer = value
                              .split("|")[0]
                              .replace("option", "");

                            // console.log(correctanswerupdatedata);
                            // console.log(correctanswer);

                            handleUpdateData(
                              correctanswerupdatedata,
                              correctanswer
                            );
                          }}
                        >
                          <SelectTrigger className="w-[130px] text-black bg-white">
                            <SelectValue
                              placeholder={
                                item.correctAnswerIndex == null
                                  ? "Choose answer"
                                  : "option" + item.correctAnswerIndex
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="text-black bg-white">
                            <SelectItem
                              value={"option1|" + item.id}
                              className="hover:bg-slate-200"
                            >
                              Option 1
                            </SelectItem>
                            <SelectItem
                              value={"option2|" + item.id}
                              className="hover:bg-slate-200"
                            >
                              Option 2
                            </SelectItem>
                            <SelectItem
                              value={"option3|" + item.id}
                              className="hover:bg-slate-200"
                            >
                              Option 3
                            </SelectItem>
                            <SelectItem
                              value={"option4|" + item.id}
                              className="hover:bg-slate-200"
                            >
                              Option 4
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </LabelInputContainer>
                    </div>
                  )}

                {item.type.toLowerCase() != "multiquestionsnormal" &&
                  item.type.toLowerCase() != "subquestions" &&
                  item.type.toLowerCase() != "multiquestionsimage" &&
                  item.type.toLowerCase() != "multiquestionsaudio" && (
                    <div className="w-full  border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2">
                      <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                        <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                          <h2 className="text-lg">Q{idx + 1}&#41; &nbsp;</h2>
                        </div>

                        <EditText
                          name={"question" + "," + item.id}
                          defaultValue={item.question}
                          editButtonProps={{
                            style: {
                              width: 16,
                              backgroundColor:
                                theme == "dark" ? "inherit" : "inherit",
                              color: theme == "dark" ? "inherit" : "inherit"
                            }
                          }}
                          style={{
                            fontSize: "16px",
                            color: theme == "dark" ? "inherit" : "inherit",
                            backgroundColor:
                              theme == "dark" ? "inherit" : "inherit"
                          }}
                          showEditButton
                          editButtonContent={
                            <div className="text-black dark:text-white">
                              {<MdModeEditOutline />}
                            </div>
                          }
                          onSave={(d) => {
                            console.log(d);
                            handleUpdateData(
                              d.name,
                              d.value,
                              item.type.toLowerCase()
                            );
                          }}
                        />
                      </div>

                      <div className="py-2">
                        {/* normal mcq start  */}
                        {item.type.toLowerCase() == "normal" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                            <div className="flex justify-start items-center">
                              <div className="h-full items-center flex justify-center ">
                                <p>1 &#41;</p>
                              </div>
                              <EditText
                                name={"option1" + "," + item.id}
                                defaultValue={item.option1}
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                            <div className=" flex justify-start items-center">
                              <div className="">2 &#41;</div>
                              <EditText
                                name={"option2" + "," + item.id}
                                defaultValue={item.option2}
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                            <div className=" flex justify-start items-center">
                              <div className="">3 &#41; &nbsp;</div>
                              <EditText
                                name={"option3" + "," + item.id}
                                defaultValue={item.option3}
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                            <div className=" flex justify-start items-center">
                              <div className="">4 &#41; &nbsp;</div>
                              <EditText
                                name={"option4" + "," + item.id}
                                defaultValue={item.option4}
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* normal mcq end  */}

                        {/* Text start  */}

                        {item.type.toLowerCase() == "evaluate" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex justify-start items-center w-full">
                              <textarea
                                type="text"
                                disabled={true}
                                className="col-span-3 flex h-10 w-full rounded-md min-h-[10rem]
                                        border border-input bg-background px-3 py-2 text-sm
                                        ring-offset-background file:border-0 file:bg-transparent
                                        file:text-sm file:font-medium placeholder:text-muted-foreground
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-ring focus-visible:ring-offset-2
                                        disabled:cursor-not-allowed disabled:opacity-50 text-black "
                                placeholder="Candidate write the answer"
                              ></textarea>
                            </div>
                          </div>
                        )}
                        {item.type.toLowerCase() == "record" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex justify-start items-center w-full">
                              <button
                                onClick={() => {
                                  speak({
                                    rate: 0.7, // Slower speech
                                    pitch: 0.5, // Slightly higher pitch
                                    volume: 1, // Full volume,
                                    text: item.question
                                  });
                                }}
                              >
                                <BiSolidVolumeFull className="text-black " />
                              </button>
                            </div>
                          </div>
                        )}

                        {item.type.toLowerCase() == "match" && (
                          <div className="w-full flex justify-start items-center flex-col text-black dark:text-white pl-4">
                            <div className="flex justify-start items-start w-full">
                              <div className="bg-purple-600 rounded-lg text-white text-sm p-1 font-bold">
                                Match the following
                              </div>
                            </div>

                            <div className="w-full flex justify-start items-center">
                              <h2 className="text-md font-bold">Questions</h2>
                            </div>

                            <div className="flex justify-between items-start w-full">
                              <div className="p-1 flex items-center flex-col justify-center">
                                <div>
                                  <h2>Left side</h2>
                                </div>
                                <JumbledSentences
                                  items={item.match_left_question}
                                  questionId={item.id}
                                  moduleId={id}
                                  column="match_question_left"
                                />
                              </div>
                              <div className="p-1  flex items-center flex-col justify-center">
                                <div>
                                  <h2>Right side</h2>
                                </div>
                                <JumbledSentences
                                  items={item.match_right_question}
                                  questionId={item.id}
                                  moduleId={id}
                                  column="match_question_right"
                                />
                              </div>
                            </div>

                            <div className="w-full flex justify-start items-center">
                              <h2 className="text-md font-bold">Answers </h2>{" "}
                              <p> &nbsp; arrange them in correct order</p>
                            </div>

                            <div className="flex justify-between items-start w-full">
                              <div className="p-1 flex items-center flex-col justify-center">
                                <div>
                                  <h2>Left side</h2>
                                </div>
                                <JumbledSentences
                                  items={item.match_left_answer}
                                  questionId={item.id}
                                  moduleId={id}
                                  column="match_answer_left"
                                />
                              </div>
                              <div className="p-1  flex items-center flex-col justify-center">
                                <div>
                                  <h2>Right side</h2>
                                </div>
                                <JumbledSentences
                                  items={item.match_right_answer}
                                  questionId={item.id}
                                  moduleId={id}
                                  column="match_answer_right"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {item.type.toLowerCase() == "jumbledsentences" && (
                          <div className="w-full flex justify-center items-center flex-col text-black dark:text-white pl-4">
                            <div className="flex justify-start items-start w-full">
                              <div className="bg-sky-600 rounded-lg text-white text-sm p-1 font-bold">
                                Jumbled Sentences
                              </div>
                            </div>
                            <div className="flex justify-center items-center w-full">
                              <JumbledSentences
                                items={item.match_single_question}
                                questionId={item.id}
                                moduleId={id}
                                column="match_question_single"
                              />
                            </div>
                            <div className="flex justify-center items-center w-full flex-col">
                              <div className="flex justify-start items-center">
                                <p className="font-bold">Answer</p>
                                <p>
                                  Provide answer please arrange them in correct
                                  order
                                </p>
                              </div>
                              <JumbledSentences
                                items={item.match_single_answer}
                                questionId={item.id}
                                moduleId={id}
                                column="match_answer_single"
                              />
                            </div>
                          </div>
                        )}

                        {item.type.toLowerCase() == "speaking" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex justify-start items-center w-full">
                              <textarea
                                type="text"
                                disabled={true}
                                className="col-span-3 flex h-10 w-full rounded-md min-h-[10rem]
                                        border border-input bg-background px-3 py-2 text-sm
                                        ring-offset-background file:border-0 file:bg-transparent
                                        file:text-sm file:font-medium placeholder:text-muted-foreground
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-ring focus-visible:ring-offset-2
                                        disabled:cursor-not-allowed disabled:opacity-50 text-black "
                                placeholder="Candidate will take speaking test from mobile app"
                              ></textarea>
                            </div>
                          </div>
                        )}
                        {item.type.toLowerCase() == "textnormal" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex justify-start items-center ">
                              <EditText
                                name={"correctAnswerIndex" + "," + item.id}
                                defaultValue={
                                  item.correctAnswerIndex
                                    ? item.correctAnswerIndex
                                    : "Write answer"
                                }
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {item.type.toLowerCase() == "textimage" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex w-full justify-center flex-col">
                              <div className="relative">
                                <img
                                  id={"img" + item.id}
                                  src={context.filesServerUrl + item.imageURL}
                                  className="w-full  object-contain max-h-[20rem]"
                                />
                                <div className="absolute bottom-2 right-0">
                                  <div
                                    className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                  >
                                    {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                    <input
                                      type="file"
                                      className="hidden"
                                      id={item.id}
                                      onChange={(event) => {
                                        const questionColumn =
                                          "imageURL" + "," + event.target.id;
                                        handleFiles(
                                          event.target.files[0],
                                          questionColumn,
                                          "img"
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={item.id}
                                      className="cursor-pointer flex flex-row items-center text-black"
                                    >
                                      <FaUpload className="mr-1" />
                                      Replace
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                <div>
                                  <p className="text-slate-300">Credits</p>
                                </div>
                                <div>
                                  <EditText
                                    name={"image_credits" + "," + item.id}
                                    defaultValue={item.imageCredits}
                                    editButtonProps={{
                                      style: {
                                        width: 16,
                                        padding: 0,
                                        backgroundColor:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit",
                                        color:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit"
                                      }
                                    }}
                                    style={{
                                      fontSize: "16px",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit",
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }}
                                    showEditButton
                                    editButtonContent={
                                      <div className="text-black dark:text-white">
                                        {<MdModeEditOutline />}
                                      </div>
                                    }
                                    onSave={(d) => {
                                      handleUpdateData(d.name, d.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <EditText
                                name={"correctAnswerIndex" + "," + item.id}
                                defaultValue={
                                  item.correctAnswerIndex
                                    ? item.correctAnswerIndex
                                    : "Write answer"
                                }
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {item.type.toLowerCase() == "textaudio" && (
                          <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                            <div className="flex w-full justify-center flex-col">
                              <div className="relative">
                                <audio controls id={"audio" + item.id}>
                                  <source
                                    src={context.filesServerUrl + item.audioURL}
                                    type="audio/ogg"
                                  />
                                  <source
                                    src={context.filesServerUrl + item.audioURL}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                                <div className="absolute bottom-2 right-0">
                                  <div
                                    className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                  >
                                    {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                    <input
                                      type="file"
                                      className="hidden"
                                      id={item.id}
                                      onChange={(event) => {
                                        const questionColumn =
                                          "audioURL" + "," + event.target.id;
                                        handleFiles(
                                          event.target.files[0],
                                          questionColumn,
                                          "audio"
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={item.id}
                                      className="cursor-pointer flex flex-row items-center text-black"
                                    >
                                      <FaUpload className="mr-1" />
                                      Replace
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                <div>
                                  <p className="text-slate-300">Credits</p>
                                </div>
                                <div>
                                  <EditText
                                    name={"image_credits" + "," + item.id}
                                    defaultValue={item.imageCredits}
                                    editButtonProps={{
                                      style: {
                                        width: 16,
                                        padding: 0,
                                        backgroundColor:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit",
                                        color:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit"
                                      }
                                    }}
                                    style={{
                                      fontSize: "16px",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit",
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }}
                                    showEditButton
                                    editButtonContent={
                                      <div className="text-black dark:text-white">
                                        {<MdModeEditOutline />}
                                      </div>
                                    }
                                    onSave={(d) => {
                                      handleUpdateData(d.name, d.value);
                                    }}
                                  />
                                </div>
                              </div>

                              <EditText
                                name={"correctAnswerIndex" + "," + item.id}
                                defaultValue={
                                  item.correctAnswerIndex
                                    ? item.correctAnswerIndex
                                    : "Write answer"
                                }
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {/* Text end  */}
                        {/* true or false start  */}

                        {item.type.toLowerCase() == "truefalse" && (
                          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 text-black dark:text-white">
                            <div className=" flex justify-start items-center">
                              <div className="">a&#41; &nbsp;</div>
                              <div className="">
                                <EditText
                                  name={"option1" + "," + item.id}
                                  defaultValue={item.option1}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className=" flex justify-start items-center">
                              <div className="">b&#41; &nbsp;</div>
                              <div className="">
                                {" "}
                                <EditText
                                  name={"option2" + "," + item.id}
                                  defaultValue={item.option2}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {/* true or false end */}

                        {/* image start   */}
                        {item.type.toLowerCase() == "image" && (
                          <div>
                            <div className="relative">
                              <img
                                id={"img" + item.id}
                                src={context.filesServerUrl + item.imageURL}
                                className="w-full  object-contain max-h-[20rem]"
                              />
                              <div className="absolute bottom-2 right-0">
                                <div
                                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                >
                                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                  <input
                                    type="file"
                                    className="hidden"
                                    id={item.id}
                                    onChange={(event) => {
                                      const questionColumn =
                                        "imageURL" + "," + event.target.id;
                                      handleFiles(
                                        event.target.files[0],
                                        questionColumn,
                                        "img"
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={item.id}
                                    className="cursor-pointer flex flex-row items-center"
                                  >
                                    <FaUpload className="mr-1" />
                                    Replace
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                              <div>
                                <p className="text-slate-300">Credits</p>
                              </div>
                              <div>
                                <EditText
                                  name={"image_credits" + "," + item.id}
                                  defaultValue={item.image_credits}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>

                            {/* options  */}

                            <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                              <div className="flex justify-start items-center">
                                <div className="h-full items-center flex justify-center ">
                                  <p>1 &#41;</p>
                                </div>
                                <EditText
                                  name={"option1" + "," + item.id}
                                  defaultValue={item.option1}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">2 &#41;</div>
                                <EditText
                                  name={"option2" + "," + item.id}
                                  defaultValue={item.option2}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">3 &#41; &nbsp;</div>
                                <EditText
                                  name={"option3" + "," + item.id}
                                  defaultValue={item.option3}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">4 &#41; &nbsp;</div>
                                <EditText
                                  name={"option4" + "," + item.id}
                                  defaultValue={item.option4}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* image end  */}

                        {/* image witrh text   */}

                        {item.type.toLowerCase() == "imagetext" && (
                          <div>
                            <div className="relative">
                              <img
                                id={"img" + item.id}
                                src={context.filesServerUrl + item.imageURL}
                                className="w-full  object-contain max-h-[20rem]"
                              />
                              <div className="absolute bottom-2 right-0">
                                <div
                                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                >
                                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                  <input
                                    type="file"
                                    className="hidden"
                                    id={item.id}
                                    onChange={(event) => {
                                      const questionColumn =
                                        "imageURL" + "," + event.target.id;
                                      handleFiles(
                                        event.target.files[0],
                                        questionColumn,
                                        "img"
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={item.id}
                                    className="cursor-pointer flex flex-row items-center"
                                  >
                                    <FaUpload className="mr-1" />
                                    Replace
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                              <div>
                                <p className="text-slate-300">Credits</p>
                              </div>
                              <div>
                                <EditText
                                  name={"image_credits" + "," + item.id}
                                  defaultValue={item.image_credits}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>

                            {/* textbox  */}

                            <div>
                              <textarea
                                name=""
                                className="w-full resize-none"
                                id=""
                                disabled
                                placeholder="This text will be filled by your student"
                              ></textarea>
                            </div>
                          </div>
                        )}

                        {/* image with text end  */}

                        {/* audio  */}

                        {item.type.toLowerCase() == "audio" && (
                          <div>
                            <div className="relative">
                              {/* <img
                            id={"audio" + item.id}
                            src={
                             context.filesServerUrl + item.imageURL
                            }
                            className="w-full  object-contain max-h-[20rem]"
                          /> */}

                              <audio controls id={"audio" + item.id}>
                                <source
                                  src={context.filesServerUrl + item.audioURL}
                                  type="audio/ogg"
                                />
                                <source
                                  src={context.filesServerUrl + item.audioURL}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>

                              <div className="absolute bottom-2 right-0">
                                <div
                                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                >
                                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                  <input
                                    type="file"
                                    className="hidden"
                                    id={item.id}
                                    onChange={(event) => {
                                      const questionColumn =
                                        "audioURL" + "," + event.target.id;
                                      handleFiles(
                                        event.target.files[0],
                                        questionColumn,
                                        "audio"
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={item.id}
                                    className="cursor-pointer flex flex-row items-center"
                                  >
                                    <FaUpload className="mr-1" />
                                    Replace
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                              <div>
                                <p className="text-slate-300">Credits</p>
                              </div>
                              <div>
                                <EditText
                                  name={"image_credits" + "," + item.id}
                                  defaultValue={item.image_credits}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>

                            {/* options  */}

                            <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                              <div className="flex justify-start items-center">
                                <div className="h-full items-center flex justify-center ">
                                  <p>1 &#41;</p>
                                </div>
                                <EditText
                                  name={"option1" + "," + item.id}
                                  defaultValue={item.option1}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">2 &#41;</div>
                                <EditText
                                  name={"option2" + "," + item.id}
                                  defaultValue={item.option2}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">3 &#41; &nbsp;</div>
                                <EditText
                                  name={"option3" + "," + item.id}
                                  defaultValue={item.option3}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                              <div className=" flex justify-start items-center">
                                <div className="">4 &#41; &nbsp;</div>
                                <EditText
                                  name={"option4" + "," + item.id}
                                  defaultValue={item.option4}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* end of audio  */}

                        {/* audio with text start  */}

                        {item.type.toLowerCase() == "audiotext" && (
                          <div>
                            <div className="relative">
                              <audio controls id={"audio" + item.id}>
                                <source
                                  src={context.filesServerUrl + item.audioURL}
                                  type="audio/ogg"
                                />
                                <source
                                  src={context.filesServerUrl + item.audioURL}
                                  type="audio/mpeg"
                                />
                                Your browser does not support the audio element.
                              </audio>

                              <div className="absolute bottom-2 right-0">
                                <div
                                  className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                >
                                  {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                  <input
                                    type="file"
                                    className="hidden"
                                    id={item.id}
                                    onChange={(event) => {
                                      const questionColumn =
                                        "audioURL" + "," + event.target.id;
                                      handleFiles(
                                        event.target.files[0],
                                        questionColumn,
                                        "audio"
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={item.id}
                                    className="cursor-pointer flex flex-row items-center"
                                  >
                                    <FaUpload className="mr-1" />
                                    Replace
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                              <div>
                                <p className="text-slate-300">Credits</p>
                              </div>
                              <div>
                                <EditText
                                  name={"image_credits" + "," + item.id}
                                  defaultValue={item.image_credits}
                                  editButtonProps={{
                                    style: {
                                      width: 16,
                                      padding: 0,
                                      backgroundColor:
                                        theme == "dark" ? "inherit" : "inherit",
                                      color:
                                        theme == "dark" ? "inherit" : "inherit"
                                    }
                                  }}
                                  style={{
                                    fontSize: "16px",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit",
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }}
                                  showEditButton
                                  editButtonContent={
                                    <div className="text-black dark:text-white">
                                      {<MdModeEditOutline />}
                                    </div>
                                  }
                                  onSave={(d) => {
                                    handleUpdateData(d.name, d.value);
                                  }}
                                />
                              </div>
                            </div>

                            {/* Textarea  */}
                            <div>
                              <textarea
                                name=""
                                className="w-full resize-none"
                                id=""
                                disabled
                                placeholder="This text will be filled by your student"
                              ></textarea>
                            </div>
                          </div>
                        )}

                        {/* audio with text end  */}
                        {/* Jumbled words start */}

                        {item.type.toLowerCase() == "jumbledwords" && (
                          <div className="text-black dark:text-white">
                            <div className="flex flex-wrap ">
                              <div
                                id={"jumbled" + item.id}
                                className="flex flex-wrap"
                              >
                                {item.jumbled_question_order != "" &&
                                  item.jumbled_question_order != null &&
                                  item.jumbled_question_order
                                    .split(",")
                                    .map((ele, index) => {
                                      return (
                                        <button
                                          key={index}
                                          id={item.id + "|" + "buttoninside"}
                                          onClick={(e) => {
                                            e.currentTarget.remove();
                                            console.log(
                                              e.currentTarget.id.split("|")[0]
                                            );

                                            updateJumbledWords(
                                              document.getElementById(
                                                "jumbled" +
                                                  e.currentTarget.id.split(
                                                    "|"
                                                  )[0]
                                              ),
                                              e.currentTarget.id.split("|")[0]
                                            );
                                          }}
                                          className="flex items-center justify-between outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 hover:text-white"
                                        >
                                          <div className="pr-2">{ele}</div>
                                          <MdCancel size={18} />
                                        </button>
                                      );
                                    })}
                              </div>

                              <div className="flex items-center">
                                <input
                                  name=""
                                  type="input"
                                  className="text-black bg-none rounded-md border-0 text-gray-900 p-1 mr-2 placeholder:text-gray-400   sm:text-sm sm:leading-6"
                                  placeholder="Add jumble words"
                                />

                                <button
                                  id={"addjumbled|" + item.id}
                                  className=" flex outline-none mr-1 mb-1 border border-solid border-white hover:border-slate-500 rounded-full px-4 py-2 bg-transparent text-xs text-white font-bold uppercase focus:outline-none active:bg-slate-600 hover:bg-slate-600 hover:text-white"
                                  onClick={(e) => {
                                    // e.currentTarget.remove();
                                    const value =
                                      e.currentTarget.previousElementSibling
                                        .value;
                                    e.currentTarget.previousElementSibling.value =
                                      "";

                                    if (value != "") {
                                      const id =
                                        e.currentTarget.id.split("|")[1];
                                      handledJumbled(id, value);
                                    }
                                  }}
                                >
                                  <IoMdAdd size={18} />
                                  <div className="pr-2">Add</div>
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-end items-center w-full mt-5 mb-1">
                              <EditText
                                className="border-slate-500 border-2 p-2 rounded border-solid my-3"
                                name={"jumbled_answer_order" + "," + item.id}
                                defaultValue={
                                  "Provide answer for jumbled sentence"
                                }
                                editButtonProps={{
                                  style: {
                                    width: 16,
                                    padding: 0,
                                    backgroundColor:
                                      theme == "dark" ? "inherit" : "inherit",
                                    color:
                                      theme == "dark" ? "inherit" : "inherit"
                                  }
                                }}
                                style={{
                                  fontSize: "16px",
                                  color:
                                    theme == "dark" ? "inherit" : "inherit",
                                  backgroundColor:
                                    theme == "dark" ? "inherit" : "inherit"
                                }}
                                showEditButton
                                editButtonContent={
                                  <div className="text-black dark:text-white">
                                    {<MdModeEditOutline />}
                                  </div>
                                }
                                onSave={(d) => {
                                  handleUpdateData(d.name, d.value);
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Jumbled words end  */}
                      </div>
                    </div>
                  )}

                {/* multi questions  */}

                {item.type.toLowerCase() == "multiquestionsnormal" && (
                  <div className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2">
                    <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                      <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                        <h2 className="text-lg">Q{idx + 1}&#41; &nbsp;</h2>
                      </div>

                      <EditText
                        name={"question" + "," + item.id}
                        defaultValue={item.question}
                        editButtonProps={{
                          style: {
                            width: 16,
                            backgroundColor:
                              theme == "dark" ? "inherit" : "inherit",
                            color: theme == "dark" ? "inherit" : "inherit"
                          }
                        }}
                        style={{
                          fontSize: "16px",
                          color: theme == "dark" ? "inherit" : "inherit",
                          backgroundColor:
                            theme == "dark" ? "inherit" : "inherit"
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

                    <LabelInputContainer className="flex flex-row items-center justify-between">
                      {/* <Label htmlFor="firstname">Login as </Label> */}
                      <Select
                        className="text-black bg-white"
                        value={questionType}
                        onValueChange={(value) => {
                          handleAddSubQuestion(value, item.id);
                          setquestionType("");
                        }}
                      >
                        <SelectTrigger className="w-[180px] text-black bg-white">
                          <SelectValue placeholder="Add question" />
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white">
                          <SelectItem
                            value="mcq"
                            className="hover:bg-slate-200"
                          >
                            MCQ
                          </SelectItem>
                          <SelectItem
                            value="textnormal"
                            className="hover:bg-slate-200"
                          >
                            Text
                          </SelectItem>
                          <SelectItem
                            value="textimage"
                            className="hover:bg-slate-200"
                          >
                            Text with Image
                          </SelectItem>
                          <SelectItem
                            value="textaudio"
                            className="hover:bg-slate-200"
                          >
                            Text with Audio
                          </SelectItem>
                          <SelectItem
                            value="imagemcq"
                            className="hover:bg-slate-200"
                          >
                            Image with MCQ
                          </SelectItem>
                          <SelectItem
                            value="truefalse"
                            className="hover:bg-slate-200"
                          >
                            True or False
                          </SelectItem>

                          <SelectItem
                            value="audiomcq"
                            className="hover:bg-slate-200"
                          >
                            Audio with MCQ
                          </SelectItem>

                          <SelectItem
                            value="jumblewords"
                            className="hover:bg-slate-200"
                          >
                            Jumble Words
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </LabelInputContainer>

                    <div className="my-4 w-full flex justify-end items-center ">
                      <div className="w-11/12">
                        {item.subQuestions.length > 0 &&
                          item.subQuestions.map((ele, index) => {
                            return (
                              <div
                                key={index}
                                className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2 my-3 "
                              >
                                {/* delete button  */}
                                <AlertDialog className="relative">
                                  <AlertDialogTrigger
                                    asChild
                                    className="absolute right-0 top-0"
                                  >
                                    <Button
                                      variant="outline"
                                      id={"btn|" + ele.id}
                                      onClick={(e) => {
                                        setdeletequestion(
                                          e.currentTarget.id.split("|")[1]
                                        );
                                      }}
                                      className="outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 dark:text-red-600 dark:hover:text-white z-50 mt-2 "
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure ?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this question.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={handleDeleteQuestion}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                {/* delete button  */}

                                {/* answer button  */}

                                {ele.type.toLowerCase() != "textnormal" &&
                                  ele.type.toLowerCase() != "textimage" &&
                                  ele.type.toLowerCase() != "textaudio" &&
                                  ele.type.toLowerCase() != "evaluate" &&
                                  ele.type.toLowerCase() != "record" &&
                                  item.type.toLowerCase() != "match" &&
                                  item.type.toLowerCase() !=
                                    "jumbledsentences" &&
                                  ele.type.toLowerCase() != "speaking" && (
                                    <div className="absolute right-2 bottom-1 z-50">
                                      <LabelInputContainer className="flex flex-row items-center justify-between">
                                        {/* <Label htmlFor="firstname">Login as </Label> */}
                                        <Select
                                          defaultValue={
                                            ele.correctAnswerIndex == null
                                              ? "Choose answer"
                                              : "option" +
                                                ele.correctAnswerIndex +
                                                "|" +
                                                ele.id
                                          }
                                          id={"selectanswer|" + ele.id}
                                          className="text-black bg-white"
                                          onValueChange={(value) => {
                                            let correctanswerupdatedata =
                                              "correctAnswerIndex" +
                                              "," +
                                              value.split("|")[1];

                                            let correctanswer = value
                                              .split("|")[0]
                                              .replace("option", "");

                                            // console.log(correctanswerupdatedata);
                                            // console.log(correctanswer);

                                            handleUpdateData(
                                              correctanswerupdatedata,
                                              correctanswer
                                            );
                                          }}
                                        >
                                          <SelectTrigger className="w-[130px] text-black bg-white">
                                            <SelectValue placeholder="Choose Answer" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white">
                                            <SelectItem
                                              value={"option1|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 1
                                            </SelectItem>
                                            <SelectItem
                                              value={"option2|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 2
                                            </SelectItem>
                                            <SelectItem
                                              value={"option3|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 3
                                            </SelectItem>
                                            <SelectItem
                                              value={"option4|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 4
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                    </div>
                                  )}
                                {/* answer button  */}

                                {/* question  */}
                                <div>
                                  <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                                    <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                                      <h2 className="text-lg">
                                        Q{index + 1}&#41; &nbsp;
                                      </h2>
                                    </div>

                                    <EditText
                                      name={"question" + "," + ele.id}
                                      defaultValue={ele.question}
                                      editButtonProps={{
                                        style: {
                                          width: 16,
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }
                                      }}
                                      style={{
                                        fontSize: "16px",
                                        color:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit",
                                        backgroundColor:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit"
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

                                {/* questions  */}
                                <div className="my-3">
                                  {ele.type.toLowerCase() == "normal" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center">
                                        <div className="h-full items-center flex justify-center ">
                                          <p>1 &#41;</p>
                                        </div>
                                        <EditText
                                          name={"option1" + "," + ele.id}
                                          defaultValue={ele.option1}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">2 &#41;</div>
                                        <EditText
                                          name={"option2" + "," + ele.id}
                                          defaultValue={ele.option2}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">3 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option3" + "," + ele.id}
                                          defaultValue={ele.option3}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">4 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option4" + "," + ele.id}
                                          defaultValue={ele.option4}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {ele.type.toLowerCase() == "evaluate" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center w-full">
                                        <textarea
                                          type="text"
                                          disabled={true}
                                          className="col-span-3 flex h-10 w-full rounded-md min-h-[10rem]
                                        border border-input bg-background px-3 py-2 text-sm
                                        ring-offset-background file:border-0 file:bg-transparent
                                        file:text-sm file:font-medium placeholder:text-muted-foreground
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-ring focus-visible:ring-offset-2
                                        disabled:cursor-not-allowed disabled:opacity-50 text-black "
                                          placeholder="Candidate write the answer"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}
                                  {ele.type.toLowerCase() == "record" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center w-full">
                                        <button
                                          onClick={() => {
                                            speak({
                                              rate: 0.7, // Slower speech
                                              pitch: 0.5, // Slightly higher pitch
                                              volume: 1, // Full volume,
                                              text: ele.question
                                            });
                                          }}
                                        >
                                          <BiSolidVolumeFull className="text-black " />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {ele.type.toLowerCase() == "speaking" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center w-full">
                                        <textarea
                                          type="text"
                                          disabled={true}
                                          className="col-span-3 flex h-10 w-full rounded-md min-h-[10rem]
                                        border border-input bg-background px-3 py-2 text-sm
                                        ring-offset-background file:border-0 file:bg-transparent
                                        file:text-sm file:font-medium placeholder:text-muted-foreground
                                        focus-visible:outline-none focus-visible:ring-2
                                        focus-visible:ring-ring focus-visible:ring-offset-2
                                        disabled:cursor-not-allowed disabled:opacity-50 text-black "
                                          placeholder="Candidate take the speaking test from mobile app"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {ele.type.toLowerCase() == "textnormal" && (
                                    <div className="w-full flex justify-start items-start">
                                      <EditText
                                        name={
                                          "correctAnswerIndex" + "," + ele.id
                                        }
                                        defaultValue={
                                          ele.correctAnswerIndex
                                            ? ele.correctAnswerIndex
                                            : "Write answer"
                                        }
                                        editButtonProps={{
                                          style: {
                                            width: 16,
                                            padding: 0,
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }}
                                        showEditButton
                                        editButtonContent={
                                          <div className="text-black dark:text-white">
                                            {<MdModeEditOutline />}
                                          </div>
                                        }
                                        onSave={(d) => {
                                          handleUpdateData(d.name, d.value);
                                        }}
                                      />
                                    </div>
                                  )}

                                  {ele.type.toLowerCase() == "textimage" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <img
                                            id={"img" + ele.id}
                                            src={
                                              context.filesServerUrl +
                                              ele.imageURL
                                            }
                                            className="w-full  object-contain max-h-[20rem]"
                                          />
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "imageURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "img"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {ele.type.toLowerCase() == "textaudio" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <audio controls id={"audio" + ele.id}>
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/ogg"
                                            />
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                          </audio>
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "audioURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "audio"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* true or false start  */}

                                  {ele.type.toLowerCase() == "truefalse" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 text-black dark:text-white">
                                      <div className=" flex justify-start items-center">
                                        <div className="">a&#41; &nbsp;</div>
                                        <div className="">
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">b&#41; &nbsp;</div>
                                        <div className="">
                                          {" "}
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* true or false end */}

                                  {/* image start   */}
                                  {ele.type.toLowerCase() == "image" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* image end  */}

                                  {/* image witrh text   */}

                                  {ele.type.toLowerCase() == "imagetext" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* textbox  */}

                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* image with text end  */}

                                  {/* audio  */}

                                  {ele.type.toLowerCase() == "audio" && (
                                    <div>
                                      <div className="relative">
                                        {/* <img
                            id={"audio" + ele.id}
                            src={
                             context.filesServerUrl + ele.imageURL
                            }
                            className="w-full  object-contain max-h-[20rem]"
                          /> */}

                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* end of audio  */}

                                  {/* audio with text start  */}

                                  {ele.type.toLowerCase() == "audiotext" && (
                                    <div>
                                      <div className="relative">
                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Textarea  */}
                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* audio with text end  */}
                                  {/* Jumbled words start */}

                                  {ele.type.toLowerCase() == "jumbledwords" && (
                                    <div className="text-black dark:text-white">
                                      <div className="flex flex-wrap ">
                                        <div
                                          id={"jumbled" + ele.id}
                                          className="flex flex-wrap"
                                        >
                                          {ele.jumbled_question_order != "" &&
                                            ele.jumbled_question_order !=
                                              null &&
                                            ele.jumbled_question_order
                                              .split(",")
                                              .map((ele, index) => {
                                                return (
                                                  <button
                                                    key={index}
                                                    id={
                                                      ele.id +
                                                      "|" +
                                                      "buttoninside"
                                                    }
                                                    onClick={(e) => {
                                                      e.currentTarget.remove();
                                                      console.log(
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );

                                                      updateJumbledWords(
                                                        document.getElementById(
                                                          "jumbled" +
                                                            e.currentTarget.id.split(
                                                              "|"
                                                            )[0]
                                                        ),
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );
                                                    }}
                                                    className="flex items-center justify-between outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 hover:text-white"
                                                  >
                                                    <div className="pr-2">
                                                      {ele}
                                                    </div>
                                                    <MdCancel size={18} />
                                                  </button>
                                                );
                                              })}
                                        </div>

                                        <div className="flex items-center">
                                          <input
                                            name=""
                                            type="input"
                                            className="text-black bg-none rounded-md border-0 text-gray-900 p-1 mr-2 placeholder:text-gray-400   sm:text-sm sm:leading-6"
                                            placeholder="Add jumble words"
                                          />

                                          <button
                                            id={"addjumbled|" + ele.id}
                                            className=" flex outline-none mr-1 mb-1 border border-solid border-white hover:border-slate-500 rounded-full px-4 py-2 bg-transparent text-xs text-white font-bold uppercase focus:outline-none active:bg-slate-600 hover:bg-slate-600 hover:text-white"
                                            onClick={(e) => {
                                              // e.currentTarget.remove();
                                              const value =
                                                e.currentTarget
                                                  .previousElementSibling.value;
                                              e.currentTarget.previousElementSibling.value =
                                                "";

                                              if (value != "") {
                                                const id =
                                                  e.currentTarget.id.split(
                                                    "|"
                                                  )[1];
                                                handledJumbled(id, value);
                                              }
                                            }}
                                          >
                                            <IoMdAdd size={18} />
                                            <div className="pr-2">Add</div>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex justify-end items-center w-full mt-5 mb-1">
                                        <EditText
                                          className="border-slate-500 border-2 p-2 rounded border-solid my-3"
                                          name={
                                            "jumbled_answer_order" +
                                            "," +
                                            ele.id
                                          }
                                          defaultValue={
                                            "Provide answer for jumbled sentence"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* endig of ub questions  */}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* multi questions  */}

                {/* multi questions  */}

                {item.type.toLowerCase() == "multiquestionsimage" && (
                  <div className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2">
                    <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                      <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                        <h2 className="text-lg">Q{idx + 1}&#41; &nbsp;</h2>
                      </div>

                      <EditText
                        name={"question" + "," + item.id}
                        defaultValue={item.question}
                        editButtonProps={{
                          style: {
                            width: 16,
                            backgroundColor:
                              theme == "dark" ? "inherit" : "inherit",
                            color: theme == "dark" ? "inherit" : "inherit"
                          }
                        }}
                        style={{
                          fontSize: "16px",
                          color: theme == "dark" ? "inherit" : "inherit",
                          backgroundColor:
                            theme == "dark" ? "inherit" : "inherit"
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
                    {/* image of mutliquestions  */}
                    <div>
                      <div className="relative">
                        <img
                          id={"img" + item.id}
                          src={context.filesServerUrl + item.imageURL}
                          className="w-full  object-contain max-h-[20rem]"
                        />
                        <div className="absolute bottom-2 right-0">
                          <div
                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                          >
                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                            <input
                              type="file"
                              className="hidden"
                              id={item.id}
                              onChange={(event) => {
                                const questionColumn =
                                  "imageURL" + "," + event.target.id;
                                handleFiles(
                                  event.target.files[0],
                                  questionColumn,
                                  "img"
                                );
                              }}
                            />
                            <label
                              htmlFor={item.id}
                              className="cursor-pointer flex flex-row items-center"
                            >
                              <FaUpload className="mr-1" />
                              Replace
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                        <div>
                          <p className="text-slate-300">Credits</p>
                        </div>
                        <div>
                          <EditText
                            name={"image_credits" + "," + item.id}
                            defaultValue={item.image_credits}
                            editButtonProps={{
                              style: {
                                width: 16,
                                padding: 0,
                                backgroundColor:
                                  theme == "dark" ? "inherit" : "inherit",
                                color: theme == "dark" ? "inherit" : "inherit"
                              }
                            }}
                            style={{
                              fontSize: "16px",
                              color: theme == "dark" ? "inherit" : "inherit",
                              backgroundColor:
                                theme == "dark" ? "inherit" : "inherit"
                            }}
                            showEditButton
                            editButtonContent={
                              <div className="text-black dark:text-white">
                                {<MdModeEditOutline />}
                              </div>
                            }
                            onSave={(d) => {
                              handleUpdateData(d.name, d.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <LabelInputContainer className="flex flex-row items-center justify-between">
                      {/* <Label htmlFor="firstname">Login as </Label> */}
                      <Select
                        className="text-black bg-white"
                        value={questionType}
                        onValueChange={(value) => {
                          handleAddSubQuestion(value, item.id);
                          setquestionType("");
                        }}
                      >
                        <SelectTrigger className="w-[180px] text-black bg-white">
                          <SelectValue placeholder="Add question" />
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white">
                          <SelectItem
                            value="mcq"
                            className="hover:bg-slate-200"
                          >
                            MCQ
                          </SelectItem>
                          <SelectItem
                            value="textnormal"
                            className="hover:bg-slate-200"
                          >
                            Text
                          </SelectItem>
                          <SelectItem
                            value="textimage"
                            className="hover:bg-slate-200"
                          >
                            Text with Image
                          </SelectItem>
                          <SelectItem
                            value="textaudio"
                            className="hover:bg-slate-200"
                          >
                            Text with audio
                          </SelectItem>
                          <SelectItem
                            value="imagemcq"
                            className="hover:bg-slate-200"
                          >
                            Image with MCQ
                          </SelectItem>
                          <SelectItem
                            value="truefalse"
                            className="hover:bg-slate-200"
                          >
                            True or False
                          </SelectItem>

                          <SelectItem
                            value="audiomcq"
                            className="hover:bg-slate-200"
                          >
                            Audio with MCQ
                          </SelectItem>

                          <SelectItem
                            value="jumblewords"
                            className="hover:bg-slate-200"
                          >
                            Jumble Words
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </LabelInputContainer>
                    <div className="my-4 w-full flex justify-end items-center ">
                      <div className="w-11/12">
                        {item.subQuestions.length > 0 &&
                          item.subQuestions.map((ele, index) => {
                            return (
                              <div
                                key={index}
                                className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2 my-3 "
                              >
                                {/* delete button  */}
                                <AlertDialog className="relative">
                                  <AlertDialogTrigger
                                    asChild
                                    className="absolute right-0 top-0"
                                  >
                                    <Button
                                      variant="outline"
                                      id={"btn|" + ele.id}
                                      onClick={(e) => {
                                        setdeletequestion(
                                          e.currentTarget.id.split("|")[1]
                                        );
                                      }}
                                      className="outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 dark:text-red-600 dark:hover:text-white z-50 mt-2 "
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure ?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this question.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={handleDeleteQuestion}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                {/* delete button  */}

                                {/* answer button  */}
                                {ele.type.toLowerCase() != "textnormal" &&
                                  ele.type.toLowerCase() != "textimage" &&
                                  ele.type.toLowerCase() != "textaudio" && (
                                    <div className="absolute right-2 bottom-1 z-50">
                                      <LabelInputContainer className="flex flex-row items-center justify-between">
                                        {/* <Label htmlFor="firstname">Login as </Label> */}
                                        <Select
                                          defaultValue={
                                            ele.correctAnswerIndex == null
                                              ? "Choose answer"
                                              : "option" +
                                                ele.correctAnswerIndex +
                                                "|" +
                                                ele.id
                                          }
                                          id={"selectanswer|" + ele.id}
                                          className="text-black bg-white"
                                          onValueChange={(value) => {
                                            let correctanswerupdatedata =
                                              "correctAnswerIndex" +
                                              "," +
                                              value.split("|")[1];

                                            let correctanswer = value
                                              .split("|")[0]
                                              .replace("option", "");

                                            // console.log(correctanswerupdatedata);
                                            // console.log(correctanswer);

                                            handleUpdateData(
                                              correctanswerupdatedata,
                                              correctanswer
                                            );
                                          }}
                                        >
                                          <SelectTrigger className="w-[130px] text-black bg-white">
                                            <SelectValue placeholder="Choose Answer" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white">
                                            <SelectItem
                                              value={"option1|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 1
                                            </SelectItem>
                                            <SelectItem
                                              value={"option2|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 2
                                            </SelectItem>
                                            <SelectItem
                                              value={"option3|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 3
                                            </SelectItem>
                                            <SelectItem
                                              value={"option4|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 4
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                    </div>
                                  )}

                                {/* answer button  */}

                                {/* question  */}
                                <div>
                                  <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                                    <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                                      <h2 className="text-lg">
                                        Q{index + 1}&#41; &nbsp;
                                      </h2>
                                    </div>

                                    <EditText
                                      name={"question" + "," + ele.id}
                                      defaultValue={ele.question}
                                      editButtonProps={{
                                        style: {
                                          width: 16,
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }
                                      }}
                                      style={{
                                        fontSize: "16px",
                                        color:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit",
                                        backgroundColor:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit"
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

                                {/* questions  */}
                                <div className="my-3">
                                  {ele.type.toLowerCase() == "normal" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center">
                                        <div className="h-full items-center flex justify-center ">
                                          <p>1 &#41;</p>
                                        </div>
                                        <EditText
                                          name={"option1" + "," + ele.id}
                                          defaultValue={ele.option1}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">2 &#41;</div>
                                        <EditText
                                          name={"option2" + "," + ele.id}
                                          defaultValue={ele.option2}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">3 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option3" + "," + ele.id}
                                          defaultValue={ele.option3}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">4 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option4" + "," + ele.id}
                                          defaultValue={ele.option4}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* textstart  */}

                                  {ele.type.toLowerCase() == "textnormal" && (
                                    <div className="w-full flex justify-start items-start">
                                      <EditText
                                        name={
                                          "correctAnswerIndex" + "," + ele.id
                                        }
                                        defaultValue={
                                          ele.correctAnswerIndex
                                            ? ele.correctAnswerIndex
                                            : "Write answer"
                                        }
                                        editButtonProps={{
                                          style: {
                                            width: 16,
                                            padding: 0,
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }}
                                        showEditButton
                                        editButtonContent={
                                          <div className="text-black dark:text-white">
                                            {<MdModeEditOutline />}
                                          </div>
                                        }
                                        onSave={(d) => {
                                          handleUpdateData(d.name, d.value);
                                        }}
                                      />
                                    </div>
                                  )}

                                  {ele.type.toLowerCase() == "textimage" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <img
                                            id={"img" + ele.id}
                                            src={
                                              context.filesServerUrl +
                                              ele.imageURL
                                            }
                                            className="w-full  object-contain max-h-[20rem]"
                                          />
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "imageURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "img"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {ele.type.toLowerCase() == "textaudio" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <audio controls id={"audio" + ele.id}>
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/ogg"
                                            />
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                          </audio>
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "audioURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "audio"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {/* textstart  */}

                                  {/* true or false start  */}

                                  {ele.type.toLowerCase() == "truefalse" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 text-black dark:text-white">
                                      <div className=" flex justify-start items-center">
                                        <div className="">a&#41; &nbsp;</div>
                                        <div className="">
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">b&#41; &nbsp;</div>
                                        <div className="">
                                          {" "}
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* true or false end */}

                                  {/* image start   */}
                                  {ele.type.toLowerCase() == "image" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* image end  */}

                                  {/* image witrh text   */}

                                  {ele.type.toLowerCase() == "imagetext" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* textbox  */}

                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* image with text end  */}

                                  {/* audio  */}

                                  {ele.type.toLowerCase() == "audio" && (
                                    <div>
                                      <div className="relative">
                                        {/* <img
                            id={"audio" + ele.id}
                            src={
                             context.filesServerUrl + ele.imageURL
                            }
                            className="w-full  object-contain max-h-[20rem]"
                          /> */}

                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* end of audio  */}

                                  {/* audio with text start  */}

                                  {ele.type.toLowerCase() == "audiotext" && (
                                    <div>
                                      <div className="relative">
                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Textarea  */}
                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* audio with text end  */}
                                  {/* Jumbled words start */}

                                  {ele.type.toLowerCase() == "jumbledwords" && (
                                    <div className="text-black dark:text-white">
                                      <div className="flex flex-wrap ">
                                        <div
                                          id={"jumbled" + ele.id}
                                          className="flex flex-wrap"
                                        >
                                          {ele.jumbled_question_order != "" &&
                                            ele.jumbled_question_order !=
                                              null &&
                                            ele.jumbled_question_order
                                              .split(",")
                                              .map((ele, index) => {
                                                return (
                                                  <button
                                                    key={index}
                                                    id={
                                                      ele.id +
                                                      "|" +
                                                      "buttoninside"
                                                    }
                                                    onClick={(e) => {
                                                      e.currentTarget.remove();
                                                      console.log(
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );

                                                      updateJumbledWords(
                                                        document.getElementById(
                                                          "jumbled" +
                                                            e.currentTarget.id.split(
                                                              "|"
                                                            )[0]
                                                        ),
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );
                                                    }}
                                                    className="flex items-center justify-between outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 hover:text-white"
                                                  >
                                                    <div className="pr-2">
                                                      {ele}
                                                    </div>
                                                    <MdCancel size={18} />
                                                  </button>
                                                );
                                              })}
                                        </div>

                                        <div className="flex items-center">
                                          <input
                                            name=""
                                            type="input"
                                            className="text-black bg-none rounded-md border-0 text-gray-900 p-1 mr-2 placeholder:text-gray-400   sm:text-sm sm:leading-6"
                                            placeholder="Add jumble words"
                                          />

                                          <button
                                            id={"addjumbled|" + ele.id}
                                            className=" flex outline-none mr-1 mb-1 border border-solid border-white hover:border-slate-500 rounded-full px-4 py-2 bg-transparent text-xs text-white font-bold uppercase focus:outline-none active:bg-slate-600 hover:bg-slate-600 hover:text-white"
                                            onClick={(e) => {
                                              // e.currentTarget.remove();
                                              const value =
                                                e.currentTarget
                                                  .previousElementSibling.value;
                                              e.currentTarget.previousElementSibling.value =
                                                "";

                                              if (value != "") {
                                                const id =
                                                  e.currentTarget.id.split(
                                                    "|"
                                                  )[1];
                                                handledJumbled(id, value);
                                              }
                                            }}
                                          >
                                            <IoMdAdd size={18} />
                                            <div className="pr-2">Add</div>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex justify-end items-center w-full mt-5 mb-1">
                                        <EditText
                                          className="border-slate-500 border-2 p-2 rounded border-solid my-3"
                                          name={
                                            "jumbled_answer_order" +
                                            "," +
                                            ele.id
                                          }
                                          defaultValue={
                                            "Provide answer for jumbled sentence"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* endig of ub questions  */}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {item.type.toLowerCase() == "multiquestionsaudio" && (
                  <div className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2">
                    <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                      <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                        <h2 className="text-lg">Q{idx + 1}&#41; &nbsp;</h2>
                      </div>

                      <EditText
                        name={"question" + "," + item.id}
                        defaultValue={item.question}
                        editButtonProps={{
                          style: {
                            width: 16,
                            backgroundColor:
                              theme == "dark" ? "inherit" : "inherit",
                            color: theme == "dark" ? "inherit" : "inherit"
                          }
                        }}
                        style={{
                          fontSize: "16px",
                          color: theme == "dark" ? "inherit" : "inherit",
                          backgroundColor:
                            theme == "dark" ? "inherit" : "inherit"
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
                    {/* image of mutliquestions  */}
                    <div>
                      <div className="relative">
                        <audio controls id={"audio" + item.id}>
                          <source
                            src={context.filesServerUrl + item.audioURL}
                            type="audio/ogg"
                          />
                          <source
                            src={context.filesServerUrl + item.audioURL}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>

                        <div className="absolute bottom-2 right-0">
                          <div
                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                          >
                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                            <input
                              type="file"
                              className="hidden"
                              id={item.id}
                              onChange={(event) => {
                                const questionColumn =
                                  "audioURL" + "," + event.target.id;
                                handleFiles(
                                  event.target.files[0],
                                  questionColumn,
                                  "audio"
                                );
                              }}
                            />
                            <label
                              htmlFor={item.id}
                              className="cursor-pointer flex flex-row items-center"
                            >
                              <FaUpload className="mr-1" />
                              Replace
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                        <div>
                          <p className="text-slate-300">Credits</p>
                        </div>
                        <div>
                          <EditText
                            name={"image_credits" + "," + item.id}
                            defaultValue={item.image_credits}
                            editButtonProps={{
                              style: {
                                width: 16,
                                padding: 0,
                                backgroundColor:
                                  theme == "dark" ? "inherit" : "inherit",
                                color: theme == "dark" ? "inherit" : "inherit"
                              }
                            }}
                            style={{
                              fontSize: "16px",
                              color: theme == "dark" ? "inherit" : "inherit",
                              backgroundColor:
                                theme == "dark" ? "inherit" : "inherit"
                            }}
                            showEditButton
                            editButtonContent={
                              <div className="text-black dark:text-white">
                                {<MdModeEditOutline />}
                              </div>
                            }
                            onSave={(d) => {
                              handleUpdateData(d.name, d.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <LabelInputContainer className="flex flex-row items-center justify-between">
                      {/* <Label htmlFor="firstname">Login as </Label> */}
                      <Select
                        className="text-black bg-white"
                        value={questionType}
                        onValueChange={(value) => {
                          handleAddSubQuestion(value, item.id);
                          setquestionType("");
                        }}
                      >
                        <SelectTrigger className="w-[180px] text-black bg-white">
                          <SelectValue placeholder="Add question" />
                        </SelectTrigger>
                        <SelectContent className="text-black bg-white">
                          <SelectItem
                            value="mcq"
                            className="hover:bg-slate-200"
                          >
                            MCQ
                          </SelectItem>
                          <SelectItem
                            value="textnormal"
                            className="hover:bg-slate-200"
                          >
                            Text
                          </SelectItem>
                          <SelectItem
                            value="textimage"
                            className="hover:bg-slate-200"
                          >
                            Text with Image
                          </SelectItem>
                          <SelectItem
                            value="textaudio"
                            className="hover:bg-slate-200"
                          >
                            Text with Audio
                          </SelectItem>
                          <SelectItem
                            value="imagemcq"
                            className="hover:bg-slate-200"
                          >
                            Image with MCQ
                          </SelectItem>
                          <SelectItem
                            value="truefalse"
                            className="hover:bg-slate-200"
                          >
                            True or False
                          </SelectItem>

                          <SelectItem
                            value="audiomcq"
                            className="hover:bg-slate-200"
                          >
                            Audio with MCQ
                          </SelectItem>

                          <SelectItem
                            value="jumblewords"
                            className="hover:bg-slate-200"
                          >
                            Jumble Words
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </LabelInputContainer>
                    <div className="my-4 w-full flex justify-end items-center ">
                      <div className="w-11/12">
                        {item.subQuestions.length > 0 &&
                          item.subQuestions.map((ele, index) => {
                            return (
                              <div
                                key={index}
                                className="w-full drop-shadow-md hover:drop-shadow-xl border border-black dark:border-slate-100 border-dashed rounded-md px-4 py-2 my-3 "
                              >
                                {/* delete button  */}
                                <AlertDialog className="relative">
                                  <AlertDialogTrigger
                                    asChild
                                    className="absolute right-0 top-0"
                                  >
                                    <Button
                                      variant="outline"
                                      id={"btn|" + ele.id}
                                      onClick={(e) => {
                                        setdeletequestion(
                                          e.currentTarget.id.split("|")[1]
                                        );
                                      }}
                                      className="outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 dark:text-red-600 dark:hover:text-white z-50 mt-2 "
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure ?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this question.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={handleDeleteQuestion}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                {/* delete button  */}

                                {/* answer button  */}

                                {ele.type.toLowerCase() != "textnormal" &&
                                  ele.type.toLowerCase() != "textimage" &&
                                  ele.type.toLowerCase() != "textaudio" && (
                                    <div className="absolute right-2 bottom-1 z-50">
                                      <LabelInputContainer className="flex flex-row items-center justify-between">
                                        {/* <Label htmlFor="firstname">Login as </Label> */}
                                        <Select
                                          defaultValue={
                                            ele.correctAnswerIndex == null
                                              ? "Choose answer"
                                              : "option" +
                                                ele.correctAnswerIndex +
                                                "|" +
                                                ele.id
                                          }
                                          id={"selectanswer|" + ele.id}
                                          className="text-black bg-white"
                                          onValueChange={(value) => {
                                            let correctanswerupdatedata =
                                              "correctAnswerIndex" +
                                              "," +
                                              value.split("|")[1];

                                            let correctanswer = value
                                              .split("|")[0]
                                              .replace("option", "");

                                            // console.log(correctanswerupdatedata);
                                            // console.log(correctanswer);

                                            handleUpdateData(
                                              correctanswerupdatedata,
                                              correctanswer
                                            );
                                          }}
                                        >
                                          <SelectTrigger className="w-[130px] text-black bg-white">
                                            <SelectValue placeholder="Choose Answer" />
                                          </SelectTrigger>
                                          <SelectContent className="text-black bg-white">
                                            <SelectItem
                                              value={"option1|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 1
                                            </SelectItem>
                                            <SelectItem
                                              value={"option2|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 2
                                            </SelectItem>
                                            <SelectItem
                                              value={"option3|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 3
                                            </SelectItem>
                                            <SelectItem
                                              value={"option4|" + ele.id}
                                              className="hover:bg-slate-200"
                                            >
                                              Option 4
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </LabelInputContainer>
                                    </div>
                                  )}

                                {ele.type.toLowerCase() == "textimage" && (
                                  <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                    <div className="flex w-full justify-center flex-col">
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center text-black"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.imageCredits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <EditText
                                        name={
                                          "correctAnswerIndex" + "," + ele.id
                                        }
                                        defaultValue={
                                          ele.correctAnswerIndex
                                            ? ele.correctAnswerIndex
                                            : "Write answer"
                                        }
                                        editButtonProps={{
                                          style: {
                                            width: 16,
                                            padding: 0,
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }}
                                        showEditButton
                                        editButtonContent={
                                          <div className="text-black dark:text-white">
                                            {<MdModeEditOutline />}
                                          </div>
                                        }
                                        onSave={(d) => {
                                          handleUpdateData(d.name, d.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {ele.type.toLowerCase() == "textaudio" && (
                                  <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                    <div className="flex w-full justify-center flex-col">
                                      <div className="relative">
                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center text-black"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.imageCredits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <EditText
                                        name={
                                          "correctAnswerIndex" + "," + ele.id
                                        }
                                        defaultValue={
                                          ele.correctAnswerIndex
                                            ? ele.correctAnswerIndex
                                            : "Write answer"
                                        }
                                        editButtonProps={{
                                          style: {
                                            width: 16,
                                            padding: 0,
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }}
                                        showEditButton
                                        editButtonContent={
                                          <div className="text-black dark:text-white">
                                            {<MdModeEditOutline />}
                                          </div>
                                        }
                                        onSave={(d) => {
                                          handleUpdateData(d.name, d.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {/* answer button  */}

                                {/* question  */}
                                <div>
                                  <div className="flex question w-full text-black dark:text-white items-baseline justify-start flex-nowrap">
                                    <div className="h-full items-center flex justify-center w-[40px] flex-nowrap flex-row">
                                      <h2 className="text-lg">
                                        Q{index + 1}&#41; &nbsp;
                                      </h2>
                                    </div>

                                    <EditText
                                      name={"question" + "," + ele.id}
                                      defaultValue={ele.question}
                                      editButtonProps={{
                                        style: {
                                          width: 16,
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }
                                      }}
                                      style={{
                                        fontSize: "16px",
                                        color:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit",
                                        backgroundColor:
                                          theme == "dark"
                                            ? "inherit"
                                            : "inherit"
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

                                {/* questions  */}
                                <div className="my-3">
                                  {ele.type.toLowerCase() == "normal" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                      <div className="flex justify-start items-center">
                                        <div className="h-full items-center flex justify-center ">
                                          <p>1 &#41;</p>
                                        </div>
                                        <EditText
                                          name={"option1" + "," + ele.id}
                                          defaultValue={ele.option1}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">2 &#41;</div>
                                        <EditText
                                          name={"option2" + "," + ele.id}
                                          defaultValue={ele.option2}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">3 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option3" + "," + ele.id}
                                          defaultValue={ele.option3}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">4 &#41; &nbsp;</div>
                                        <EditText
                                          name={"option4" + "," + ele.id}
                                          defaultValue={ele.option4}
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* textstart  */}

                                  {ele.type.toLowerCase() == "textnormal" && (
                                    <div className="w-full flex justify-start items-start">
                                      <EditText
                                        name={
                                          "correctAnswerIndex" + "," + ele.id
                                        }
                                        defaultValue={
                                          ele.correctAnswerIndex
                                            ? ele.correctAnswerIndex
                                            : "Write answer"
                                        }
                                        editButtonProps={{
                                          style: {
                                            width: 16,
                                            padding: 0,
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          color:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit",
                                          backgroundColor:
                                            theme == "dark"
                                              ? "inherit"
                                              : "inherit"
                                        }}
                                        showEditButton
                                        editButtonContent={
                                          <div className="text-black dark:text-white">
                                            {<MdModeEditOutline />}
                                          </div>
                                        }
                                        onSave={(d) => {
                                          handleUpdateData(d.name, d.value);
                                        }}
                                      />
                                    </div>
                                  )}

                                  {ele.type.toLowerCase() == "textimage" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <img
                                            id={"img" + ele.id}
                                            src={
                                              context.filesServerUrl +
                                              ele.imageURL
                                            }
                                            className="w-full  object-contain max-h-[20rem]"
                                          />
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "imageURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "img"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {ele.type.toLowerCase() == "textaudio" && (
                                    <div className="w-full flex justify-start items-center flex-row text-black dark:text-white pl-4">
                                      <div className="flex w-full justify-center flex-col">
                                        <div className="relative">
                                          <audio controls id={"audio" + ele.id}>
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/ogg"
                                            />
                                            <source
                                              src={
                                                context.filesServerUrl +
                                                ele.audioURL
                                              }
                                              type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                          </audio>
                                          <div className="absolute bottom-2 right-0">
                                            <div
                                              className="flex flex-row items-center justify-between inline-block cursor-pointer
                                                font-bold 
                                                mr-4 py-2 px-4
                                                rounded-full file:border-0
                                                text-sm file:font-semibold
                                                bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100"
                                            >
                                              {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                              <input
                                                type="file"
                                                className="hidden"
                                                id={ele.id}
                                                onChange={(event) => {
                                                  const questionColumn =
                                                    "audioURL" +
                                                    "," +
                                                    event.target.id;
                                                  handleFiles(
                                                    event.target.files[0],
                                                    questionColumn,
                                                    "audio"
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={ele.id}
                                                className="cursor-pointer flex flex-row items-center text-black"
                                              >
                                                <FaUpload className="mr-1" />
                                                Replace
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                          <div>
                                            <p className="text-slate-300">
                                              Credits
                                            </p>
                                          </div>
                                          <div>
                                            <EditText
                                              name={
                                                "image_credits" + "," + ele.id
                                              }
                                              defaultValue={ele.imageCredits}
                                              editButtonProps={{
                                                style: {
                                                  width: 16,
                                                  padding: 0,
                                                  backgroundColor:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit",
                                                  color:
                                                    theme == "dark"
                                                      ? "inherit"
                                                      : "inherit"
                                                }
                                              }}
                                              style={{
                                                fontSize: "16px",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }}
                                              showEditButton
                                              editButtonContent={
                                                <div className="text-black dark:text-white">
                                                  {<MdModeEditOutline />}
                                                </div>
                                              }
                                              onSave={(d) => {
                                                handleUpdateData(
                                                  d.name,
                                                  d.value
                                                );
                                              }}
                                            />
                                          </div>
                                        </div>

                                        <EditText
                                          name={
                                            "correctAnswerIndex" + "," + ele.id
                                          }
                                          defaultValue={
                                            ele.correctAnswerIndex
                                              ? ele.correctAnswerIndex
                                              : "Write answer"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {/* textstart  */}

                                  {/* true or false start  */}

                                  {ele.type.toLowerCase() == "truefalse" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 text-black dark:text-white">
                                      <div className=" flex justify-start items-center">
                                        <div className="">a&#41; &nbsp;</div>
                                        <div className="">
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className=" flex justify-start items-center">
                                        <div className="">b&#41; &nbsp;</div>
                                        <div className="">
                                          {" "}
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {/* true or false end */}

                                  {/* image start   */}
                                  {ele.type.toLowerCase() == "image" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* image end  */}

                                  {/* image witrh text   */}

                                  {ele.type.toLowerCase() == "imagetext" && (
                                    <div>
                                      <div className="relative">
                                        <img
                                          id={"img" + ele.id}
                                          src={
                                            context.filesServerUrl +
                                            ele.imageURL
                                          }
                                          className="w-full  object-contain max-h-[20rem]"
                                        />
                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "imageURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "img"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* textbox  */}

                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* image with text end  */}

                                  {/* audio  */}

                                  {ele.type.toLowerCase() == "audio" && (
                                    <div>
                                      <div className="relative">
                                        {/* <img
                            id={"audio" + ele.id}
                            src={
                             context.filesServerUrl + ele.imageURL
                            }
                            className="w-full  object-contain max-h-[20rem]"
                          /> */}

                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* options  */}

                                      <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 text-black dark:text-white pl-4">
                                        <div className="flex justify-start items-center">
                                          <div className="h-full items-center flex justify-center ">
                                            <p>1 &#41;</p>
                                          </div>
                                          <EditText
                                            name={"option1" + "," + ele.id}
                                            defaultValue={ele.option1}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">2 &#41;</div>
                                          <EditText
                                            name={"option2" + "," + ele.id}
                                            defaultValue={ele.option2}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">3 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option3" + "," + ele.id}
                                            defaultValue={ele.option3}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                        <div className=" flex justify-start items-center">
                                          <div className="">4 &#41; &nbsp;</div>
                                          <EditText
                                            name={"option4" + "," + ele.id}
                                            defaultValue={ele.option4}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* end of audio  */}

                                  {/* audio with text start  */}

                                  {ele.type.toLowerCase() == "audiotext" && (
                                    <div>
                                      <div className="relative">
                                        <audio controls id={"audio" + ele.id}>
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/ogg"
                                          />
                                          <source
                                            src={
                                              context.filesServerUrl +
                                              ele.audioURL
                                            }
                                            type="audio/mpeg"
                                          />
                                          Your browser does not support the
                                          audio element.
                                        </audio>

                                        <div className="absolute bottom-2 right-0">
                                          <div
                                            className="flex flex-row items-center justify-between inline-block cursor-pointer
                              font-bold 
                              mr-4 py-2 px-4
                              rounded-full file:border-0
                              text-sm file:font-semibold
                              bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                                          >
                                            {/* <button type="button" className="text-white dark:text-black">Replace</button> */}
                                            <input
                                              type="file"
                                              className="hidden"
                                              id={ele.id}
                                              onChange={(event) => {
                                                const questionColumn =
                                                  "audioURL" +
                                                  "," +
                                                  event.target.id;
                                                handleFiles(
                                                  event.target.files[0],
                                                  questionColumn,
                                                  "audio"
                                                );
                                              }}
                                            />
                                            <label
                                              htmlFor={ele.id}
                                              className="cursor-pointer flex flex-row items-center"
                                            >
                                              <FaUpload className="mr-1" />
                                              Replace
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-row justify-start items-center text-black dark:text-white py-4">
                                        <div>
                                          <p className="text-slate-300">
                                            Credits
                                          </p>
                                        </div>
                                        <div>
                                          <EditText
                                            name={
                                              "image_credits" + "," + ele.id
                                            }
                                            defaultValue={ele.image_credits}
                                            editButtonProps={{
                                              style: {
                                                width: 16,
                                                padding: 0,
                                                backgroundColor:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit",
                                                color:
                                                  theme == "dark"
                                                    ? "inherit"
                                                    : "inherit"
                                              }
                                            }}
                                            style={{
                                              fontSize: "16px",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }}
                                            showEditButton
                                            editButtonContent={
                                              <div className="text-black dark:text-white">
                                                {<MdModeEditOutline />}
                                              </div>
                                            }
                                            onSave={(d) => {
                                              handleUpdateData(d.name, d.value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {/* Textarea  */}
                                      <div>
                                        <textarea
                                          name=""
                                          className="w-full resize-none"
                                          id=""
                                          disabled
                                          placeholder="This text will be filled by your student"
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}

                                  {/* audio with text end  */}
                                  {/* Jumbled words start */}

                                  {ele.type.toLowerCase() == "jumbledwords" && (
                                    <div className="text-black dark:text-white">
                                      <div className="flex flex-wrap ">
                                        <div
                                          id={"jumbled" + ele.id}
                                          className="flex flex-wrap"
                                        >
                                          {ele.jumbled_question_order != "" &&
                                            ele.jumbled_question_order !=
                                              null &&
                                            ele.jumbled_question_order
                                              .split(",")
                                              .map((ele, index) => {
                                                return (
                                                  <button
                                                    key={index}
                                                    id={
                                                      ele.id +
                                                      "|" +
                                                      "buttoninside"
                                                    }
                                                    onClick={(e) => {
                                                      e.currentTarget.remove();
                                                      console.log(
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );

                                                      updateJumbledWords(
                                                        document.getElementById(
                                                          "jumbled" +
                                                            e.currentTarget.id.split(
                                                              "|"
                                                            )[0]
                                                        ),
                                                        e.currentTarget.id.split(
                                                          "|"
                                                        )[0]
                                                      );
                                                    }}
                                                    className="flex items-center justify-between outline-none mr-1 mb-1 border border-solid border-red-500 hover:border-red-500 rounded-full px-4 py-2 bg-transparent text-xs text-red-500 font-bold uppercase focus:outline-none active:bg-red-600 hover:bg-red-600 hover:text-white"
                                                  >
                                                    <div className="pr-2">
                                                      {ele}
                                                    </div>
                                                    <MdCancel size={18} />
                                                  </button>
                                                );
                                              })}
                                        </div>

                                        <div className="flex items-center">
                                          <input
                                            name=""
                                            type="input"
                                            className="text-black bg-none rounded-md border-0 text-gray-900 p-1 mr-2 placeholder:text-gray-400   sm:text-sm sm:leading-6"
                                            placeholder="Add jumble words"
                                          />

                                          <button
                                            id={"addjumbled|" + ele.id}
                                            className=" flex outline-none mr-1 mb-1 border border-solid border-white hover:border-slate-500 rounded-full px-4 py-2 bg-transparent text-xs text-white font-bold uppercase focus:outline-none active:bg-slate-600 hover:bg-slate-600 hover:text-white"
                                            onClick={(e) => {
                                              // e.currentTarget.remove();
                                              const value =
                                                e.currentTarget
                                                  .previousElementSibling.value;
                                              e.currentTarget.previousElementSibling.value =
                                                "";

                                              if (value != "") {
                                                const id =
                                                  e.currentTarget.id.split(
                                                    "|"
                                                  )[1];
                                                handledJumbled(id, value);
                                              }
                                            }}
                                          >
                                            <IoMdAdd size={18} />
                                            <div className="pr-2">Add</div>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex justify-end items-center w-full mt-5 mb-1">
                                        <EditText
                                          className="border-slate-500 border-2 p-2 rounded border-solid my-3"
                                          name={
                                            "jumbled_answer_order" +
                                            "," +
                                            ele.id
                                          }
                                          defaultValue={
                                            "Provide answer for jumbled sentence"
                                          }
                                          editButtonProps={{
                                            style: {
                                              width: 16,
                                              padding: 0,
                                              backgroundColor:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit",
                                              color:
                                                theme == "dark"
                                                  ? "inherit"
                                                  : "inherit"
                                            }
                                          }}
                                          style={{
                                            fontSize: "16px",
                                            color:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit",
                                            backgroundColor:
                                              theme == "dark"
                                                ? "inherit"
                                                : "inherit"
                                          }}
                                          showEditButton
                                          editButtonContent={
                                            <div className="text-black dark:text-white">
                                              {<MdModeEditOutline />}
                                            </div>
                                          }
                                          onSave={(d) => {
                                            handleUpdateData(d.name, d.value);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* endig of ub questions  */}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* multi questions  */}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Quizdetails;
