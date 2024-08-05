import React from "react";
import StudentHeader from "./StudentHeader";
import StudentStatus from "./StudentStatus";

const Student = () => {
  return (
    <>
      <div className="my-4  w-full py-4 text-black dark:text-white p-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 place-content-between lg:grid-cols-3 justify-items-stretch gap-1 text-black dark:text-white ">
        
        <div className="bg-violet-800 rounded-md p-4 lg:min-h-40 md:min-h-28 min-h-24">

          <div className="p-2">
                <div>
                  <h2>Registered</h2>
                </div>
          </div>

        </div>
        <div className="bg-white lg:min-h-40 md:min-h-28 min-h-24">dfkvbndgkjb</div>
        <div className="bg-red-500 lg:min-h-40 md:min-h-28 min-h-24">kjvngijbnk</div>
        
        </div>
      </div> */}

        <main className="flex-1 p-6">
          <StudentHeader student_id={student_id} />
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

          <StudentStatus />
        </main>
      </div>
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

export default Student;
