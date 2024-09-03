import React, { useEffect, useState, useContext } from "react";
import useAuth from "../../../hooks/useAuth";
import nouser from "../../../assets/nouser.jpg";
import axios from "axios";

import { GlobalInfo } from "./../../../App";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../ui/dropdown";

const StudentHeader = ({ student_id }) => {
  const tokenData = useAuth();
  const [profile, setprofile] = useState("");
  const context = useContext(GlobalInfo);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios({
      method: "post",
      url: context.apiEndPoint + "profile",
      data: {
        student_id: student_id
      }
    });

    console.log(res.data);

    setprofile(res.data);
  };

  return (
    <>
      <div>
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold">Dashboard</div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger className=" bg-white dark:bg-black">
                <div className="flex items-center space-x-4">
                  <span>Hi, {profile.first_name}</span>
                  <img
                    src={nouser}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-black dark:text-white min-w-[150px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.replace("/login");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
    </>
  );
};

export default StudentHeader;
