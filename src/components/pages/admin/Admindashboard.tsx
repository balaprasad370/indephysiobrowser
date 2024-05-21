import React from "react";

const Dashboard = () => {
  return (
    <>
      <div>
        <div className="text-white">Admin</div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.replace("/login");
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;
