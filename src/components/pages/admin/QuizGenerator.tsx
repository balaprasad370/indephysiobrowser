import React, { useState, useEffect } from "react";
import { Input } from "./../../ui/input";
import axios from "axios";
import { Link } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";
import useAuth from "./../../../hooks/useAuth";
import IframeQuiz from "../../pages/iframes/IframeQuiz";
import QuizOETReading from "./admincomponents/QuizOETReading";
import QuizOETReadingB from "./admincomponents/QuizOETReadingB";
import QuizOETReadingC from "./admincomponents/QuizOETReadingC";
import QuizOETWriting from "./admincomponents/oettest/QuizOETWriting";
import QuizOETListening from "./admincomponents/oettest/QuizOETListening";
import QuizOETSpeaking from "./admincomponents/oettest/QuizOETSpeaking";
import QuizListening from "./admincomponents/generatorcomponents/Listening";
import { Hourglass } from "react-loader-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select.tsx";

const QuizGenerator = () => {
  const [questionTypes, setquestionTypes] = useState([
    {
      mcq: true,
      TrueFalse: true,
      Blanks: true,
      Comprehension: true,
      Listening: true,
      Jumbled: false,
      OETReadingA: true,
      OETReadingB: true,
      OETReadingC: true,
      OETWriting: true,
      OETListening: true,
      OETSpeaking: true
    }
  ]);

  const tokenData = useAuth();

  const [currentType, setcurrentType] = useState("mcq");
  const [chapters, setchapters] = useState([]);
  const [modules, setmodules] = useState([]);
  const [ChapterId, setChapterId] = useState("");
  const [moduleId, setmoduleId] = useState("");
  const [grammartopic, setgrammartopic] = useState("");
  const [topic, settopic] = useState("");
  const [totalQuestions, settotalQuestions] = useState(0);
  const [level, setlevel] = useState("A1");
  const [language, setlanguage] = useState("german");
  const [passageQuestions, setpassageQuestions] = useState(0);
  const [passageWords, setpassageWords] = useState(0);
  const [generatedOutput, setgeneratedOutput] = useState("");
  const [disableStatus, setdisableStatus] = useState(false);

  const [error, seterror] = useState("");

  const [readingOET, setreadingOET] = useState({});

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

  const handleSubmit = async () => {
    seterror("");

    if (totalQuestions == 0 || totalQuestions == "") {
      seterror("Enter Number of questions needed");
      return;
    }
    if (topic == 0 || topic == "") {
      seterror("Enter the Topic");
      return;
    }
    if (ChapterId == 0 || ChapterId == "") {
      seterror("Choose the Module");
      return;
    }
    if (moduleId == 0 || moduleId == "") {
      seterror("Choose the Quiz");
      return;
    }
    if (level == 0 || level == "") {
      seterror("Choose the level");
      return;
    }
    if (language == 0 || language == "") {
      seterror("Choose the language");
      return;
    }

    setdisableStatus(true);

    const obj = {
      totalQuestions: totalQuestions,
      topic: topic,
      chapterId: ChapterId,
      moduleId: moduleId,
      grammarTopic: grammartopic,
      level: level,
      language: language,
      type: currentType,
      passageWords: setpassageWords,
      passageQuestions: passageQuestions
    };

    try {
      const res = await axios({
        method: "post",
        url: "https://server.indephysio.com/generate/quiz",
        data: obj
      });
      console.log(res.data);
      setgeneratedOutput(res.data);
      setdisableStatus(false);
    } catch (error) {
      console.log(error);
    }

    console.log(obj);
  };

  return (
    <>
      <div className="flex items-start justify-center">
        <div className="p-6 rounded-lg w-11/12 flex flex-col h-full">
          <div className="flex flex-row justify-start items-center flex-wrap ">
            {questionTypes.map((ele, idx) => {
              return (
                <div
                  className="flex flex-row justify-start items-center flex-wrap "
                  key={idx}
                >
                  {Object.keys(ele).map((key, index) => {
                    return (
                      <button
                        key={index}
                        disabled={ele[key] ? false : true}
                        className={
                          "disabled:opacity-75 disabled:border-none m-1 p-1 px-2 rounded-md dark:text-white border dark:!border-white border-solid"
                        }
                        style={{
                          cursor: ele[key] ? "pointer" : "not-allowed",
                          backgroundColor:
                            currentType == key.toLowerCase()
                              ? "#0d9488"
                              : "inherit",
                          color: currentType == key.toLowerCase() && "#fff"
                        }}
                        onClick={() => {
                          setcurrentType(key.toLowerCase());
                        }}
                      >
                        <div>
                          {key.toLowerCase() == "oetreadinga" &&
                            "OET Reading A"}
                          {key.toLowerCase() == "oetreadingb" &&
                            "OET Reading B"}
                          {key.toLowerCase() == "oetreadingc" &&
                            "OET Reading C"}
                          {key.toLowerCase() != "oetreadingc" &&
                            key.toLowerCase() != "oetreadinga" &&
                            key.toLowerCase() != "oetreadingb" &&
                            key.charAt(0).toUpperCase() +
                              key.slice(1, key.length)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="flex flex-row flex-wrap text-black dark:text-white items-start justify-start">
            {/* Form Section */}
            {(currentType == "mcq" ||
              currentType == "truefalse" ||
              currentType == "blanks" ||
              currentType == "comprehension") && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <div className="flex flex-col space-y-4 w-11/12">
                  <div className="w-full flex  items-start justify-start flex-col">
                    <label className="block font-bold">
                      How Many Questions?
                    </label>
                    <input
                      type="number"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black "
                      placeholder="No.of questions"
                      onChange={(e) => {
                        settotalQuestions(e.target.value);
                      }}
                    />
                  </div>

                  {currentType == "comprehension" && (
                    <div className="w-full flex  items-start justify-start flex-col">
                      <label className="block font-bold">
                        How many words of passage ?{" "}
                      </label>
                      <input
                        type="text"
                        className="col-span-3 text-black flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter number"
                        onChange={(e) => {
                          setpassageWords(e.target.value);
                        }}
                      />
                    </div>
                  )}
                  {currentType == "comprehension" && (
                    <div className="w-full flex  items-start justify-start flex-col">
                      <label className="block font-bold">
                        How many questions for each passage?
                      </label>
                      <input
                        type="text"
                        className="col-span-3 text-black flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter number"
                        onChange={(e) => {
                          setpassageQuestions(e.target.value);
                        }}
                      />
                    </div>
                  )}
                  <div className="w-full flex  items-start justify-start flex-col">
                    <label className="block font-bold">Topic</label>
                    <input
                      type="text"
                      className="col-span-3 text-black flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Topic"
                      onChange={(e) => {
                        settopic(e.target.value);
                      }}
                    />
                  </div>

                  <div className="w-full flex  items-start justify-start flex-col">
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
                      <SelectTrigger className="w-full text-black bg-white">
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
                          <SelectItem
                            value="0"
                            disabled
                            className="hover:bg-slate-200"
                          >
                            No Chapters found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 mt-4 w-11/12">
                  <div className="w-full flex  items-start justify-start flex-col">
                    <div className="flex justify-between w-full items-center">
                      <label className="block font-bold">Quiz</label>
                      <div className="flex items-center">
                        <Link
                          to={"/admin/quiz/sub/" + ChapterId}
                          target="_blank"
                          className={`text-blue-600 flex items-center ${
                            ChapterId == "" &&
                            "text-slate-300 pointer-events-none"
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
                        console.log(value);
                        setmoduleId(value);
                      }}
                    >
                      <SelectTrigger className="w-full text-black bg-white">
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
                          <SelectItem
                            value="0"
                            disabled
                            className="hover:bg-slate-200"
                          >
                            No Modules found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full flex  items-start justify-start flex-col">
                    <label className="block font-bold">
                      Grammar Topic (if applicable)
                    </label>
                    <input
                      type="text"
                      className="col-span-3 text-black flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Grammar Topic"
                      onChange={(e) => {
                        setgrammartopic(e.target.value);
                      }}
                    />
                  </div>

                  <div className="w-full flex  items-start justify-start flex-col">
                    <label className="block font-bold">Level of German</label>
                    <Select
                      className="text-black bg-white w-full flex border-input  border"
                      style={{
                        borderWidth: "1px",
                        borderColor: "#e5e7eb"
                      }}
                      // value={ChapterId}
                      onValueChange={(value) => {
                        // console.log(value);
                        setlevel(value);
                      }}
                    >
                      <SelectTrigger className="w-full text-black bg-white">
                        <SelectValue placeholder="Choose Level" />
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        <SelectItem value={"A1"} className="hover:bg-slate-200">
                          A1 Level
                        </SelectItem>
                        <SelectItem value={"A2"} className="hover:bg-slate-200">
                          A2 Level
                        </SelectItem>
                        <SelectItem value={"B1"} className="hover:bg-slate-200">
                          B1 Level
                        </SelectItem>
                        <SelectItem value={"B2"} className="hover:bg-slate-200">
                          B2 Level
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full flex items-start justify-start flex-col my-4">
                    <label className="block font-bold">Output language</label>
                    <Select
                      className="text-black bg-white w-full flex border-input  border"
                      style={{
                        borderWidth: "1px",
                        borderColor: "#e5e7eb"
                      }}
                      // value={ChapterId}
                      onValueChange={(value) => {
                        setlanguage(value);
                        console.log(value);
                      }}
                    >
                      <SelectTrigger className="w-full text-black bg-white">
                        <SelectValue placeholder="Choose Language" />
                      </SelectTrigger>
                      <SelectContent className="text-black bg-white">
                        <SelectItem
                          value={"German"}
                          className="hover:bg-slate-200"
                        >
                          German
                        </SelectItem>
                        <SelectItem
                          value={"English"}
                          className="hover:bg-slate-200"
                        >
                          English
                        </SelectItem>
                        <SelectItem
                          value={"Hindi"}
                          className="hover:bg-slate-200"
                        >
                          Hindi
                        </SelectItem>
                        <SelectItem
                          value={"French"}
                          className="hover:bg-slate-200"
                        >
                          French
                        </SelectItem>
                        <SelectItem
                          value={"Tamil"}
                          className="hover:bg-slate-200"
                        >
                          Tamil
                        </SelectItem>
                        <SelectItem
                          value={"Telugu"}
                          className="hover:bg-slate-200"
                        >
                          Telugu
                        </SelectItem>
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
            )}

            {currentType == "listening" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizListening
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}

            {currentType == "oetreadinga" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETReading
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}
            {currentType == "oetreadingb" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETReadingB
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}
            {currentType == "oetreadingc" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETReadingC
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}
            {currentType == "oetwriting" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETWriting
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}
            {currentType == "oetspeaking" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETSpeaking
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}
            {currentType == "oetlistening" && (
              <div className="flex flex-col lg:w-3/12 items-start justify-start md:w-full sm:w-full xs:full w-full text-sm">
                <QuizOETListening
                  moduleId={moduleId}
                  setmoduleId={setmoduleId}
                  disableStatus={disableStatus}
                  setgeneratedOutput={setgeneratedOutput}
                  setdisableStatus={setdisableStatus}
                />
              </div>
            )}

            {/* Document Section */}
            <div className="mt-6 lg:w-9/12 md:w-full sm:w-full xs:w-full h-full w-full">
              {/* <h2 className="text-lg font-semibold">Output </h2> */}
              <div className="border border-dashed border-black dark:border-white rounded-md h-full  p-5 text-start">
                {disableStatus && (
                  <div className="w-full items-center justify-center flex flex-col">
                    <Hourglass
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="hourglass-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      colors={["#306cce", "#72a1ed"]}
                    />
                    <div>Generating Content...</div>
                  </div>
                )}
                {/* 
                {generatedOutput != "" &&
                  generatedOutput.map((ele, index) => {
                    return (
                      <div className="my-2" key={index}>
                        <p>
                          <span>{index + 1}) </span> {ele.question}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-2 justify-items-stretch gap-1 pl-4">
                          <div>a. {ele.option1}</div>
                          <div>b. {ele.option2}</div>
                          <div>c. {ele.option3}</div>
                          <div>d. {ele.option4}</div>
                        </div>
                      </div>
                    );
                  })} */}

                {moduleId != "" && (
                  <IframeQuiz id={moduleId} disableStatus={disableStatus} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizGenerator;
