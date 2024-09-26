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
import {
  IconRosetteDiscountCheckFilled,
  IconAlertOctagonFilled,
  IconHourglass,
  IconLockFilled
} from "@tabler/icons-react";

const CandidateProfile = () => {
  const params = useParams();
  const context = useContext(GlobalInfo);
  const student_id = params.id;
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [userData, setuserData] = useState({});
  const [userStatus, setuserStatus] = useState({});

  const { theme, setTheme } = context;

  const [consultanceFee, setconsultanceFee] = useState(0);

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
      //   console.log(response.data);
      setuserData(response.data);
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

  useEffect(() => {
    getData();
    getCandidateStatus();
    getConsultancyfee();
  }, []);

  return (
    <>
      <main className="flex-1 p-6 text-black dark:text-white ">
        <section>
          <div className="flex flex-col items-start">
            <p className="text-2xl ">Student Profile</p>
            <h1 className="text-2xl font-bold capitalize my-4">
              {userData?.first_name + " " + userData?.last_name}
            </h1>
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
