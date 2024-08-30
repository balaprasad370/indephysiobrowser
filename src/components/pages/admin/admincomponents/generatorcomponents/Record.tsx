import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../../ui/select.tsx";
import axios from "axios";
import Auth from "./../../../../../hooks/useAuth";

const QuizListening = ({
  disableStatus,
  setdisableStatus,
  moduleId,
  setmoduleId,
  setgeneratedOutput
}) => {
  const tokenData = Auth();

  const [passageWords, setpassageWords] = useState(0);
  const [totalPassages, settotalPassages] = useState(0);
  const [totalQuestions, settotalQuestions] = useState(0);
  const [topic, settopic] = useState("");
  const [error, seterror] = useState("");
  const [type, settype] = useState("record");
  const [level, setlevel] = useState("A1");
  const [duration, setduration] = useState(30);
  const [language, setlanguage] = useState("German");

  const [chapters, setchapters] = useState([]);
  const [modules, setmodules] = useState([]);
  const [ChapterId, setChapterId] = useState("");
  const [listenType, setlistenType] = useState("mcq");
  const [questionType, setquestionType] = useState("words");

  const handleSubmit = async () => {
    seterror("");

    if ((topic == 0 || topic == "") && listenType == "blanks") {
      seterror("Enter the Topic");
      return;
    }

    setdisableStatus(true);

    const obj = {
      topic: topic,
      chapterId: ChapterId,
      moduleId: moduleId,
      type: type,
      questionType: questionType,
      level: level,
      duration: duration,
      language: language,
      totalQuestions: totalQuestions
    };

    try {
      const res = await axios({
        method: "post",
        url: "https://server.indephysio.com/generate/quiz",
        data: obj
      });
      console.log("respone", res.data);
      setgeneratedOutput(res.data);
      setTimeout(() => {
        setdisableStatus(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setdisableStatus(false);
      }, 1000);
    }

    console.log(obj);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await axios({
        method: "get",
        url:
          "https://server.indephysio.com/chapters/userbased/" +
          tokenData.client_id
      });
      // console.log(response.data);
      setchapters(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchModules = async (chapter_id) => {
    try {
      const response = await axios({
        method: "post",
        url: "https://server.indephysio.com/chapters/modules/getone",
        data: {
          chapterId: chapter_id
        }
      });
      console.log(response.data);
      // setchapters(response.data);
      setmodules(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:w-full items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
        <div className="flex flex-col space-y-4 w-11/12 text-start">
          {listenType == "mcq" && (
            <>
              <div className="w-full flex  items-start justify-start flex-col">
                <label className="block font-bold">Topic</label>
                <textarea
                  type="text"
                  className="col-span-3 flex h-10 w-full rounded-md min-h-[4rem]
              border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent
              file:text-sm file:font-medium placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50 text-black "
                  placeholder="Eg: Diabetes"
                  onChange={(e) => {
                    settopic(e.target.value);
                  }}
                ></textarea>
              </div>

              <div className="w-full flex  items-start justify-start flex-col">
                <label className="block font-bold">No of questions</label>
                <input
                  type="number"
                  className="col-span-3 flex h-10 w-full rounded-md min-h-[2rem]
              border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent
              file:text-sm file:font-medium placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50 text-black "
                  placeholder="No of questions"
                  onChange={(e) => {
                    settotalQuestions(e.target.value);
                  }}
                />
              </div>
            </>
          )}
          <div className="w-full flex  items-start justify-start flex-col">
            <label className="block font-bold">Question Type</label>

            <div className="w-full">
              <Select
                className="text-black bg-white w-full flex border-input  border"
                style={{
                  borderWidth: "1px",
                  borderColor: "#e5e7eb"
                }}
                value={questionType}
                onValueChange={(value) => {
                  setquestionType(value);
                }}
              >
                <SelectTrigger className="w-full text-black bg-white border-slate-300 border border-solid">
                  <SelectValue placeholder="Choose Type " />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem value="words" className="hover:bg-slate-200">
                    Words
                  </SelectItem>
                  <SelectItem value="sentences" className="hover:bg-slate-200">
                    Sentences
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full flex items-start justify-start flex-col my-4">
            <label className="block font-bold">Output language</label>
            <Select
              className="text-black bg-white w-full flex border-input  border"
              style={{
                borderWidth: "1px",
                borderColor: "#e5e7eb"
              }}
              value={language}
              onValueChange={(value) => {
                setlanguage(value);
                console.log(value);
              }}
            >
              <SelectTrigger className="w-full text-black bg-white">
                <SelectValue placeholder="Choose Language" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value={"German"} className="hover:bg-slate-200">
                  German
                </SelectItem>
                <SelectItem value={"English"} className="hover:bg-slate-200">
                  English
                </SelectItem>
                <SelectItem value={"Hindi"} className="hover:bg-slate-200">
                  Hindi
                </SelectItem>
                <SelectItem value={"French"} className="hover:bg-slate-200">
                  French
                </SelectItem>
                <SelectItem value={"Tamil"} className="hover:bg-slate-200">
                  Tamil
                </SelectItem>
                <SelectItem value={"Telugu"} className="hover:bg-slate-200">
                  Telugu
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between w-full items-center">
              <label className="block font-bold">Language Level</label>
            </div>
            <Select
              className="text-black bg-white w-full flex border-input  border"
              style={{
                borderWidth: "1px",
                borderColor: "#e5e7eb"
              }}
              value={level}
              onValueChange={(value) => {
                setlevel(value);
              }}
            >
              <SelectTrigger className="w-full text-black bg-white border-slate-300 border border-solid">
                <SelectValue placeholder="Choose Level" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="A1" className="hover:bg-slate-200">
                  A1 Level
                </SelectItem>
                <SelectItem value="A2" className="hover:bg-slate-200">
                  A2 Level
                </SelectItem>
                <SelectItem value="B1" className="hover:bg-slate-200">
                  B1 Level
                </SelectItem>
                <SelectItem value="B2" className="hover:bg-slate-200">
                  B2 Level
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between w-full items-center">
              <label className="block font-bold">Module</label>
              <div className="flex items-center">
                <Link
                  to={"/admin/quiz/"}
                  target="_blank"
                  className={`text-blue-600 flex items-center`}
                >
                  <HiOutlineExternalLink /> Create Module
                </Link>
                <div className="pl-2">
                  <button
                    className="px-2 py-1"
                    onClick={() => {
                      fetchChapters();
                    }}
                  >
                    <MdRefresh color="#000" />
                  </button>
                </div>
              </div>
            </div>
            <Select
              className="text-black bg-white w-full flex border-input  border"
              style={{
                borderWidth: "1px",
                borderColor: "#e5e7eb"
              }}
              value={ChapterId}
              onValueChange={(value) => {
                // console.log(value);
                setChapterId(value);
                setmoduleId("");
                fetchModules(value);
              }}
            >
              <SelectTrigger className="w-full text-black bg-white border-slate-300 border border-solid">
                <SelectValue placeholder="Choose Module" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {chapters.length > 0 ? (
                  chapters.map((ele, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={ele.id}
                        className="hover:bg-slate-200"
                      >
                        {ele.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="0" disabled className="hover:bg-slate-200">
                    No Chapters found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full flex  items-start justify-start flex-col">
            <div className="flex justify-between w-full items-center">
              <label className="block font-bold">Quiz</label>
              <div className="flex items-center">
                <Link
                  to={"/admin/quiz/sub/" + ChapterId}
                  target="_blank"
                  className={`text-blue-600 flex items-center ${
                    ChapterId == "" && "text-slate-300 pointer-events-none"
                  }`}
                >
                  <HiOutlineExternalLink /> Create Quiz
                </Link>
                <div className="pl-2">
                  <button
                    className="px-2 py-1"
                    onClick={() => {
                      if (ChapterId != "") {
                        fetchModules(ChapterId);
                      }
                    }}
                  >
                    <MdRefresh color="#000" />
                  </button>
                </div>
              </div>
            </div>
            <Select
              className="text-black bg-white w-full flex border-input  border"
              style={{
                borderWidth: "1px",
                borderColor: "#e5e7eb"
              }}
              value={moduleId}
              onValueChange={(value) => {
                // console.log(value);
                setmoduleId(value);
              }}
            >
              <SelectTrigger className="w-full text-black bg-white border-slate-300 border border-solid">
                <SelectValue placeholder="Choose Quiz" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                {modules.length > 0 ? (
                  modules.map((ele, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={ele.id}
                        className="hover:bg-slate-200"
                      >
                        {ele.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="0" disabled className="hover:bg-slate-200">
                    No Modules found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="text-start">
            {error != "" && <p className="text-red-600">{error}</p>}
          </div>

          <div className="w-full flex items-start justify-start flex-col my-4 text-white ">
            <button
              disabled={disableStatus}
              className="bg-teal-600 disabled:opacity-75"
              onClick={() => {
                handleSubmit();
              }}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizListening;
