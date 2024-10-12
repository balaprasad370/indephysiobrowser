import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { FaRegFileLines } from "react-icons/fa6";
import {
  IconRosetteDiscountCheckFilled,
  IconAlertOctagonFilled,
  IconHourglass,
  IconLockFilled
} from "@tabler/icons-react";
import useAuth from "@/hooks/useAuth";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import { toast, Toaster } from "sonner";

const Resumes = () => {
  const { student_id } = useParams();

  const context = useContext(GlobalInfo);

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [resumes, setResumes] = useState([]);

  const getResumes = async () => {
    try {
      const response = await axios.post(
        context.apiEndPoint + "admin/student/getConsultantResumes",
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

      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    getResumes();
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

  return (
    <>
      <div className="flex flex-col gap-4 text-black dark:text-white">
        <Toaster richColors position="top-right" />
        {/* resumes  */}
        <div className="px-2 lg:px-4 py-2 ">
          <div className="px-2 lg:px-4 py-2 flex flex-col gap-4 items-center justify-center">
            <div className="flex items-center justify-between space-x-2 py-2 w-full lg:w-8/12">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <FaRegFileLines className="text-4xl text-teal-500" />
                  <h2 className="text-md lg:text-2xl md:text-lg font-bold text-teal-500">
                    Resume
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap justify-end">
                <Button
                  variant="outline"
                  className="bg-teal-500 text-white"
                  onClick={() => handleShare(resumes[0])}
                >
                  Share
                </Button>

                <Button
                  variant="outline"
                  className="bg-blue-500 text-white"
                  onClick={() => handleCopyLink(resumes[0])}
                >
                  Copy link
                </Button>
              </div>
            </div>
          </div>

          {resumes.length > 0 ? (
            <div className="flex flex-col gap-4 items-center justify-center h-svh">
              <div className="w-full h-screen lg:w-8/12">
                {resumes.map((resume, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 h-full w-full text-start shadow-none lg:shadow-lg rounded-lg "
                  >
                    <div className="px-2 lg:px-4">
                      <h2 className="text-lg font-bold my-1">{resume.title}</h2>
                      <p className="text-sm text-gray-500">
                        {resume.description.length > 30
                          ? resume.description.slice(0, 30) + "..."
                          : resume.description}
                      </p>
                    </div>
                    <div className="px-2 lg:px-4 pt-2 pb-1 h-full">
                      <div className="flex items-center justify-between overflow-hidden py-4 h-full ">
                        <iframe
                          src={`https://resume.meduniverse.app/resumeshare.php?resume=${resume.resume_session_id}`}
                          width="100%"
                          height="100%"
                          className="w-full h-full overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <p className="text-2xl font-bold">No resumes found</p>
            </div>
          )}
        </div>

        {/* end resumes  */}
      </div>
    </>
  );
};

export default Resumes;
