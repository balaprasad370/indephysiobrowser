import React, { useState, useEffect, useContext } from "react";
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
import { GlobalInfo } from "./../../../../../App";

const QuizOETSpeaking = ({
  disableStatus,
  setdisableStatus,
  moduleId,
  setmoduleId,
  setgeneratedOutput
}) => {
  const tokenData = Auth();
  const context = useContext(GlobalInfo);

  const [passageWords, setpassageWords] = useState(0);
  const [totalPassages, settotalPassages] = useState(0);
  const [totalQuestions, settotalQuestions] = useState(0);
  const [topic, settopic] = useState("");
  const [error, seterror] = useState("");
  const [type, settype] = useState("oetspeaking");

  const [chapters, setchapters] = useState([]);
  const [modules, setmodules] = useState([]);
  const [ChapterId, setChapterId] = useState("");

  const handleSubmit = async () => {
    seterror("");

    if (topic == 0 || topic == "") {
      seterror("Enter the Topic");
      return;
    }

    setdisableStatus(true);

    const obj = {
      topic: topic,
      chapterId: ChapterId,
      moduleId: moduleId,
      type: type
    };

    console.log(obj);

    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "generate/quiz",
        data: obj
      });
      console.log("respone", res.data);
      setgeneratedOutput(res.data);
      setdisableStatus(false);
    } catch (error) {
      console.log(error);
      setdisableStatus(false);
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
        url: context.apiEndPoint + "chapters/userbased/" + tokenData.client_id
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
        url: context.apiEndPoint + "chapters/modules/getone",
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
        <div className="flex flex-col space-y-4 w-11/12">
          <div className="w-full flex  items-start justify-start flex-col">
            <label className="block font-bold">Topic </label>
            <textarea
              type="text"
              className="col-span-3 flex h-10 w-full rounded-md min-h-[4rem]
              border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent
              file:text-sm file:font-medium placeholder:text-muted-foreground
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50 text-black "
              placeholder="Eg: Cancer"
              onChange={(e) => {
                settopic(e.target.value);
              }}
            ></textarea>
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

export default QuizOETSpeaking;
