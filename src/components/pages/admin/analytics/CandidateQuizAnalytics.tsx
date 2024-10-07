import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import { useParams } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { MdRefresh } from "react-icons/md";
const CandidateQuizAnalytics = () => {
  const { student_id } = useParams();
  const [token] = useState(localStorage.getItem("token"));

  const context = useContext(GlobalInfo);
  const [quizAnalytics, setQuizAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setuserData] = useState({});

  const [currentTimePeriod, setcurrentTimePeriod] = useState("today");
  const [permanentQuizAnalytics, setpermanentQuizAnalytics] = useState([]);
  const [currentQuizAnalytics, setcurrentQuizAnalytics] = useState([]);

  useEffect(() => {
    handleGetQuizAnalytics();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetQuizAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/quiz/analytics/${student_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      setQuizAnalytics(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setpermanentQuizAnalytics(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0) {
      formattedTime += `${minutes}m `;
    }
    if (seconds > 0) {
      formattedTime += `${seconds}s`;
    }
    return formattedTime.trim();
  };

  const getData = async () => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/getDetails",
        data: {
          student_id: student_id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setuserData(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const filterTodaysQuiz = () => {
    const today = moment().format("YYYY-MM-DD");

    const filteredQuiz = permanentQuizAnalytics
      .map((quiz) => {
        const levels = quiz?.levels || [];
        const filteredLevels = levels
          .map((level) => {
            const packages = level.packages || [];
            const filteredPackages = packages
              .map((pkg) => {
                const modules = pkg.modules || [];
                const filteredModules = modules
                  .map((module) => {
                    const items = module.items || [];
                    const filteredItems = items.filter((item) => {
                      const quizDate = moment(item.activity_date).format(
                        "YYYY-MM-DD"
                      );
                      const quizModifiedDate = moment(
                        item.activity_modified_date
                      ).format("YYYY-MM-DD");
                      return quizDate === today || quizModifiedDate === today;
                    });
                    return { ...module, items: filteredItems };
                  })
                  .filter((module) => module.items.length > 0);
                return { ...pkg, modules: filteredModules };
              })
              .filter((pkg) => pkg.modules.length > 0);
            return { ...level, packages: filteredPackages };
          })
          .filter((level) => level.packages.length > 0);
        return { ...quiz, levels: filteredLevels };
      })
      .filter((quiz) => quiz.levels.length > 0);

    return filteredQuiz;
  };

  useEffect(() => {
    if (permanentQuizAnalytics.length > 0) {
      if (currentTimePeriod === "today") {
        const filteredQuiz = filterTodaysQuiz();
        setQuizAnalytics(filteredQuiz);
      } else {
        setQuizAnalytics(permanentQuizAnalytics);
      }
    }
  }, [currentTimePeriod, permanentQuizAnalytics]);

  const sortQuizAnalytics = (quizAnalytics) => {
    return quizAnalytics.sort((a, b) => {
      return moment(b.activity_modified_date).diff(
        moment(a.activity_modified_date)
      );
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4 justify-start items-start px-2 lg:px-10">
      <div className="w-full">
        <div>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-row gap-2 justify-center items-center">
              <div>
                <MdOutlineAccountCircle size={30} />
              </div>
              <h2 className="text-2xl font-semibold text-teal-500">
                {" "}
                {userData.first_name} {userData.last_name}{" "}
              </h2>
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <div className="flex flex-row justify-center items-center gap-2 ">
                <button
                  onClick={handleGetQuizAnalytics}
                  className="border border-gray-500 bg-inherit p-2 rounded-md"
                >
                  <MdRefresh
                    size={20}
                    className={`text-teal-500 transition-all duration-300 ${
                      loading && "animate-spin"
                    }`}
                  />
                </button>
              </div>

              <div
                className="inline-flex rounded-md shadow-sm border border-gray-500"
                role="group"
              >
                <button
                  className={`${
                    currentTimePeriod === "today"
                      ? "bg-teal-500 focus:bg-teal-500 focus:border-none focus:outline-none text-white border-none outline-none rounded-none"
                      : ""
                  }  px-3 py-1 transition `}
                  onClick={() => setcurrentTimePeriod("today")}
                >
                  Today
                </button>
                <button
                  className={`${
                    currentTimePeriod === "total"
                      ? "bg-teal-500  focus:bg-teal-500 focus:border-none focus:outline-none text-white border-none outline-none rounded-none"
                      : ""
                  }  px-3 py-1  transition`}
                  onClick={() => setcurrentTimePeriod("total")}
                >
                  Total
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-blue-500 text-2xl font-semibold">Loading...</div>
        </div>
      ) : quizAnalytics && quizAnalytics.length > 0 ? (
        quizAnalytics.map((langLevel) => (
          <div
            key={langLevel.lang_id}
            className="w-full mb-6  bg-white rounded-lg"
          >
            {/* Language Section */}
            {/* <div className="flex justify-start items-center my-4">
              <span className="text-xl font-semibold">Language:</span>
              <h2 className="text-xl font-bold text-indigo-700 ">
                {langLevel.language_name}
              </h2>
            </div> */}

            {/* Levels Section */}
            {langLevel.levels.map((level) => (
              <div
                key={level.level_id}
                className=" mb-6 p-2 border rounded-lg  text-left"
              >
                {/* Packages Section */}
                {level.packages && level.packages.length > 0 ? (
                  level.packages.map((pkg) => (
                    <div key={pkg.package_id} className="mb-4 px-4">
                      {/* Modules Section */}
                      {pkg.modules && pkg.modules.length > 0 ? (
                        pkg.modules.map((module) => (
                          <div
                            key={module.module_id}
                            className="mb-4 bg-white rounded-lg"
                          >
                            <div className=" mb-2 flex flex-row flex-wrap justify-start items-center gap-2 py-4">
                              <div className="flex justify-start items-center gap-2">
                                <h3 className="text-md font-semibold text-left text-blue-500    ">
                                  {langLevel.language_name}
                                </h3>
                                /
                                <h3 className="text-md font-semibold text-left text-blue-500">
                                  {level.level_name} ({level.level_description})
                                </h3>
                                /
                                <h3 className="text-md font-semibold text-left text-blue-500">
                                  {pkg.package_name} ({pkg.package_description})
                                </h3>
                                /
                                <h3 className="text-md font-semibold text-left ">
                                  {module.parent_module_name} (
                                  {module.parent_module_description})
                                </h3>
                              </div>
                            </div>

                            {/* Quiz Table */}
                            <div className="overflow-x-auto">
                              <table className="table-auto min-w-[50rem] lg:min-w-full text-left mb-4 border-collapse">
                                <thead>
                                  <tr className="bg-indigo-50">
                                    <th className="px-4 py-2 border text-center">
                                      Quiz Name
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Description
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Marks
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Time Spent
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Date
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Last Attempted
                                    </th>
                                    <th className="px-4 py-2 border text-center">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {module.items && module.items.length > 0 ? (
                                    module.items.map((item) => (
                                      <tr
                                        key={item.id}
                                        className="hover:bg-gray-100"
                                      >
                                        <td className="border px-4 py-2 text-center text-md">
                                          {item.name}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          {item.description}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          {item.marks}/{item.total}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          {formatTime(item.time_spent)}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          {moment(item.activity_date).format(
                                            "hh:mm:ss a"
                                          )}
                                          <br />
                                          {moment(item.activity_date).format(
                                            "DD MMM, YYYY"
                                          )}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          {moment(
                                            item.activity_modified_date
                                          ).format("hh:mm:ss a")}
                                          <br />
                                          {moment(
                                            item.activity_modified_date
                                          ).format("DD MMM, YYYY")}{" "}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                                            View Details
                                          </button>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="7"
                                        className="border px-4 py-2 text-center"
                                      >
                                        No items available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="ml-8 text-gray-500">
                          No modules available
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="ml-6 text-gray-500">
                    No packages available
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="text-center text-red-500 text-lg w-full">
          No quiz analytics available.
          <div className="flex flex-row gap-2 justify-center items-center my-4">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-300 transition"
              onClick={() => {
                setcurrentTimePeriod("total");
              }}
            >
              Total Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateQuizAnalytics;
