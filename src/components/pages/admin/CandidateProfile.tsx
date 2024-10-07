import React, { useEffect, useState, useContext } from "react";
import StudentHeader from "./../student/StudentHeader";
import StudentStatus from "./../student/StudentStatus";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { GlobalInfo } from "./../../../App";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../ui/card.tsx";
import { MdOutlineAccountCircle } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
import { FaRegFileLines } from "react-icons/fa6";
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
} from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  IconRosetteDiscountCheckFilled,
  IconAlertOctagonFilled,
  IconHourglass,
  IconLockFilled
} from "@tabler/icons-react";
import useAuth from "@/hooks/useAuth";
import { IoMdClose } from "react-icons/io";
import { toast, Toaster } from "sonner";

const CandidateProfile = () => {
  const params = useParams();
  const context = useContext(GlobalInfo);
  const student_id = params.id;
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [userData, setuserData] = useState({});
  const [userStatus, setuserStatus] = useState({});
  const [selectedPathway, setselectedPathway] = useState("");
  const [resumes, setResumes] = useState([]);

  const tokenData = useAuth();

  const { theme, setTheme } = context;

  const [consultanceFee, setconsultanceFee] = useState(0);

  const [totalTimeSpent, setTotalTimeSpent] = useState({});
  const [totalTimeSpentToday, setTotalTimeSpentToday] = useState({});
  const [totalTimeSpentWeek, setTotalTimeSpentWeek] = useState({});
  const pathway = [
    {
      pathway: "Superfast",
      timealloted: "4"
    },
    {
      pathway: "Express",
      timealloted: "2"
    },
    {
      pathway: "Professional",
      timealloted: "1"
    },
    {
      pathway: "UG Finals",
      timealloted: "30"
    },
    {
      pathway: "UG dreamers",
      timealloted: "20"
    }
  ];

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
      console.log(response.data);
      setuserData(response.data);
      setselectedPathway(response.data.package);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getConsultancyfee = async () => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/consultancyFee",
        data: {
          student_id: student_id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setconsultanceFee(response.data.amount ?? 0);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getCandidateStatus = async () => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/candidateStatus",
        data: {
          student_id: student_id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setuserStatus(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      console.log("====================================");
      console.log(status);
      console.log("====================================");
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/updateStatus",
        data: {
          student_id: student_id,
          status: status,
          pathway: selectedPathway
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log("vdfvD", response.data);
      getCandidateStatus();
      getData();
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getResumes = async () => {
    try {
      const response = await axios.post(
        context.apiEndPoint + "admin/student/getResumes",
        {
          student_id: student_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    getData();
    getResumes();

    getCandidateStatus();
    getConsultancyfee();
  }, []);

  const handleShare = (resume) => {
    console.log(resume);
    window.open(
      `https://portal.indephysio.com/profile/resume/${resume.resume_session_id}`,
      "_blank"
    );
  };

  const handleCopyLink = async (resume) => {
    console.log(resume);
    await navigator.clipboard.writeText(
      `https://portal.indephysio.com/profile/resume/${resume.resume_session_id}`
    );
    toast.success("Link copied to clipboard");
  };

  const getTotalTimeSpent = async () => {
    try {
      const response = await axios.post(
        context.apiEndPoint + "admin/student/totalTimeSpent",
        {
          student_id: student_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setTotalTimeSpent(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getAllSectionsTodayTimeSpent = async () => {
    try {
      const response = await axios.post(
        context.apiEndPoint + "admin/student/getAllSectionsTodayTimeSpent",
        {
          student_id: student_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setTotalTimeSpentToday(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const getAllSectionsWeekTimeSpent = async () => {
    try {
      const response = await axios.post(
        context.apiEndPoint + "admin/student/getAllSectionsWeekTimeSpent",
        {
          student_id: student_id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setTotalTimeSpentWeek(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    getTotalTimeSpent();
    getAllSectionsTodayTimeSpent();
    getAllSectionsWeekTimeSpent();
  }, []);

  return (
    <>
      <main className="flex-1 p-6 text-black dark:text-white ">
        <Toaster position="top-right" richColors />
        <section>
          <div className="flex flex-col items-start">
            <div className="flex justify-between items-center w-full flex-wrap">
              <p className="text-2xl mt-2">Student Profile</p>
              {[7, 10, 11].includes(tokenData.client_id) && (
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger className="bg-blue-500 text-white text-md px-3 py-1 mt-3 rounded-md">
                      Update Registration
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                          </div>
                          <div>
                            <AlertDialogCancel>
                              <IoMdClose />
                            </AlertDialogCancel>
                          </div>
                        </div>

                        <Select
                          className="bg-white text-black"
                          value={selectedPathway}
                          onValueChange={(value) => {
                            setselectedPathway(value);
                          }}
                        >
                          <SelectTrigger className="border border-gray-300 rounded-md px-2 py-1">
                            <SelectValue placeholder="Choose pathway" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-black">
                            <SelectItem
                              value="none"
                              className="hover:bg-slate-200 cursor-pointer"
                            >
                              No pathway
                            </SelectItem>
                            <SelectItem
                              value="Superfast"
                              className="hover:bg-slate-200 cursor-pointer  "
                            >
                              Superfast
                            </SelectItem>
                            <SelectItem
                              value="Express"
                              className="hover:bg-slate-200 cursor-pointer"
                            >
                              Express
                            </SelectItem>
                            <SelectItem
                              value="Professional"
                              className="hover:bg-slate-200 cursor-pointer"
                            >
                              Professional
                            </SelectItem>
                            <SelectItem
                              value="UG Finals"
                              className="hover:bg-slate-200 cursor-pointer"
                            >
                              UG Finals
                            </SelectItem>
                            <SelectItem
                              value="UG Dreamers"
                              className="hover:bg-slate-200 cursor-pointer"
                            >
                              UG Dreamers
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => {
                            handleUpdateStatus("reject");
                          }}
                          className="bg-red-500 text-white"
                        >
                          Unregister
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleUpdateStatus("accept");
                          }}
                          className="bg-green-500 text-white"
                        >
                          Register
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineAccountCircle className="text-4xl text-teal-500" />
              <h1 className="text-2xl font-bold capitalize my-4 text-teal-500">
                {userData?.first_name + " " + userData?.last_name}
              </h1>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Status
                </CardTitle>
                {userStatus.status ? (
                  <IconRosetteDiscountCheckFilled color="green" />
                ) : (
                  <IconAlertOctagonFilled color="#FFA500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStatus.status ? "Registered" : "Not registered"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userStatus.message}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pathway</CardTitle>
                <IconHourglass />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.package == ""
                    ? "No package found"
                    : userData.package}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userData.package != "" && userData.package && (
                    <span>
                      {userData.package.toLowerCase() == "superfast" &&
                        "Commit minimum " +
                          pathway[0].timealloted +
                          " hour(s) per day"}
                      {userData.package.toLowerCase() == "express" &&
                        "Commit minimum " +
                          pathway[1].timealloted +
                          " hour(s) per day"}
                      {userData.package.toLowerCase() == "professional" &&
                        "Commit minimum " +
                          pathway[2].timealloted +
                          " hour(s) per day"}
                      {userData.package.toLowerCase() == "ug finals" &&
                        "Commit minimum " +
                          pathway[3].timealloted +
                          " minute(s) per day"}
                      {userData.package.toLowerCase() == "ug dreamers" &&
                        "Commit minimum " +
                          pathway[4].timealloted +
                          " minute(s) per day"}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <Link
                className="text-blue-500 flex flex-col font-bold px-2"
                to={"/admin/candidate/transactions/" + userData.student_id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black dark:text-white">
                    Consultancy fee
                  </CardTitle>
                  {theme === "dark" ? (
                    <img
                      key={theme}
                      src="https://d2c9u2e33z36pz.cloudfront.net/uploads/1724905230referraldark].png"
                      width="24"
                      height="24"
                    />
                  ) : (
                    <img
                      key={theme}
                      src="https://d2c9u2e33z36pz.cloudfront.net/uploads/1724586619referral.webp"
                      width="24"
                      height="24"
                    />
                  )}
                </CardHeader>

                <CardContent>
                  <div className="text-2xl font-bold">{consultanceFee}/-</div>
                  <p className="text-xs text-muted-foreground text-black dark:text-white">
                    click here to update status
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="relative">
              <Link
                className="text-blue-500 flex flex-col font-bold px-2"
                to={"/admin/candidate/documents/" + userData.student_id}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black dark:text-white">
                    Documents
                  </CardTitle>
                  {theme === "dark" ? (
                    <img
                      key={theme}
                      src="https://d2c9u2e33z36pz.cloudfront.net/uploads/1724905230leaderlight.png"
                      width="24"
                      height="24"
                    />
                  ) : (
                    <img
                      key={theme}
                      src="https://d2c9u2e33z36pz.cloudfront.net/uploads/1724586619leaderboard.webp"
                      width="24"
                      height="24"
                    />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {userData.document_status == 2
                      ? "verified"
                      : "Not verified"}
                  </div>
                  <p className="text-xs text-muted-foreground text-black dark:text-white">
                    click here to update status
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* analytics */}

          <div className="mt-4">
            {/* cards */}

            <Tabs defaultValue="today" className="w-full overflow-x-auto ">
              <div className="flex items-center justify-between">
                <div className="flex justify-start gap-4 py-4 items-start w-full">
                  <TbDeviceAnalytics className="text-4xl text-teal-500" />
                  <h1 className="text-2xl font-bold text-teal-500">
                    Analytics
                  </h1>
                </div>
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="total">Total</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="today">
                <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 my-4">
                  <div className="">
                    <Card>
                      <Link
                        to={"/admin/candidate/analytics/" + userData.student_id}
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle>Today Usage Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {totalTimeSpentToday?.totalTimeSpent == 0 ||
                            totalTimeSpentToday?.totalTimeSpent == null ||
                            totalTimeSpentToday?.totalTimeSpent == undefined
                              ? "N/A"
                              : formatTime(totalTimeSpentToday?.totalTimeSpent)}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <Link
                        to={
                          "/admin/candidate/quiz/analytics/" +
                          userData.student_id
                        }
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle>Quiz - Time Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {totalTimeSpentToday?.quiztime
                              ? formatTime(totalTimeSpentToday?.quiztime)
                              : "N/A"}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Flashcard - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentToday?.flashtime
                            ? formatTime(totalTimeSpentToday?.flashtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Reading - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentToday?.readingtime
                            ? formatTime(totalTimeSpentToday?.readingtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="week">
                <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 my-4">
                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Today Usage Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentWeek?.totalTimeSpent == 0 ||
                          totalTimeSpentWeek?.totalTimeSpent == null ||
                          totalTimeSpentWeek?.totalTimeSpent == undefined
                            ? "N/A"
                            : formatTime(totalTimeSpentWeek?.totalTimeSpent)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Quiz - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentWeek?.quiztime
                            ? formatTime(totalTimeSpentWeek?.quiztime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Flashcard - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentWeek?.flashtime
                            ? formatTime(totalTimeSpentWeek?.flashtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Reading - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpentWeek?.readingtime
                            ? formatTime(totalTimeSpentWeek?.readingtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="total">
                <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3 my-4">
                  {/* <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Total Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpent?.totalTimeSpent == 0 ||
                          totalTimeSpent?.totalTimeSpent == null ||
                          totalTimeSpent?.totalTimeSpent == undefined
                            ? "N/A"
                            : formatTime(totalTimeSpent?.totalTimeSpent)}
                        </div>
                      </CardContent>
                    </Card>
                  </div> */}
                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Today Usage Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpent?.totalTimeSpent == 0 ||
                          totalTimeSpent?.totalTimeSpent == null ||
                          totalTimeSpent?.totalTimeSpent == undefined
                            ? "N/A"
                            : formatTime(totalTimeSpent?.totalTimeSpent)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Quiz - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpent?.quiztime
                            ? formatTime(totalTimeSpent?.quiztime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Flashcard - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpent?.flashtime
                            ? formatTime(totalTimeSpent?.flashtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Reading - Time Spent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {totalTimeSpent?.readingtime
                            ? formatTime(totalTimeSpent?.readingtime)
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* cards  */}
          </div>

          {/* end analytics */}

          {/* resumes  */}
          <div>
            <div className="flex justify-between py-4 items-start">
              <div className="flex items-center gap-2">
                <FaRegFileLines className="text-4xl text-teal-500" />
                <h1 className="text-2xl font-bold text-teal-500">Resumes</h1>
              </div>
            </div>

            {resumes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4  md:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume, index) => (
                  <Card key={index}>
                    <CardHeader className="flex justify-start items-start">
                      <CardTitle>{resume.title}</CardTitle>
                      <CardDescription>
                        {resume.description.length > 30
                          ? resume.description.slice(0, 30) + "..."
                          : resume.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pt-2 pb-1">
                      <div className="flex items-center justify-between overflow-hidden pb-4 ">
                        <iframe
                          src={`https://resume.meduniverse.app/resumeshare.php?resume=${resume.resume_session_id}`}
                          width="100%"
                          height="240px"
                        />
                      </div>

                      <div className="flex items-center justify-between space-x-2 py-2">
                        <Button
                          variant="outline"
                          className="bg-teal-500 text-white"
                          onClick={() => handleShare(resume)}
                        >
                          Share
                        </Button>

                        <Button
                          variant="outline"
                          className="bg-blue-500 text-white"
                          onClick={() => handleCopyLink(resume)}
                        >
                          Copy link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="w-full flex justify-center items-center">
                <p className="text-2xl font-bold">No resumes found</p>
              </div>
            )}
          </div>

          {/* end resumes  */}
        </section>

        {/* <StudentStatus student_id={student_id} /> */}
      </main>
    </>
  );
};

const getColor = (index: number) => {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-gray-500"
  ];
  return colors[index % colors.length];
};

export default CandidateProfile;
