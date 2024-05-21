import React from "react";

const Student = () => {
  return (
    <>
      <div className="text-white">Student</div>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.replace("/login");
        }}
      >
        Logout
      </button>
    </>
  );
};

export default Student;
