import React from "react";
import StudentHeader from "./../student/StudentHeader";
import StudentStatus from "./../student/StudentStatus";
import { useParams } from "react-router-dom";

const CandidateProfile = () => {
  const params = useParams();
  const student_id = params.id;

  return (
    <>
      <main className="flex-1 p-6">

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-purple-200 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold">REGISTERED</h2>
            <p>Approx. D.O.R: 365 days to go</p>
            <p className="mt-2 text-sm">Current Status</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center relative">
            <h2 className="text-xl font-bold">Employer Messages</h2>
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
              <span className="text-lg font-bold">Unlock Access</span>
            </div>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg shadow-md text-center relative">
            <h2 className="text-xl font-bold">Peer Status</h2>
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
              <span className="text-lg font-bold">Unlock Access</span>
            </div>
          </div>
        </section>

        <StudentStatus student_id={student_id} />
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
