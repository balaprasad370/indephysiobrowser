import React from "react";

const Referral = () => {
  return (
    <>
      <div className="text-white">Referral</div>
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

export default Referral;
