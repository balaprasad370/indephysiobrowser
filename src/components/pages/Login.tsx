import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { cn } from "./../../utils/cn";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconUserCircle
} from "@tabler/icons-react";
import { Toaster, toast } from "sonner";
import useAuth from "../../hooks/useAuth";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full py-2", className)}>
      {children}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [usertype, setusertype] = useState("admin");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [usernameError, setusernameError] = useState("");
  const [passwordError, setpasswordError] = useState("");

  const tokenData = useAuth();

  
  const handleLogin = async () => {
    if (username == "") {
      setusernameError("Username cannot be empty");
    }

    if (password == "") {
      setpasswordError("Password cannot be empty");
    }

    if (username == "" || password == "") return;

    const obj = {
      email: username,
      password: password,
      usertype: usertype
    };

    // console.log(obj);

    try {
      const response = await axios({
        method: "post",
        data: obj,
        url: `https://server.indephysio.com/login`
      });

      if (response.data.status) {
        toast.success("Login successful");
        console.log(response.data);

        try {
          localStorage.setItem("token", response.data.token);
        } catch (error) {}

        setTimeout(() => {
          if (usertype == "admin") {
            navigate("/admin/dashboard");
          } else if (usertype == "student") {
            navigate("/student/dashboard");
          } else if (usertype == "referral") {
            navigate("/referral/dashboard");
          }
        }, 2000);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      // console.log("====================================");
      console.log(error);
      // console.log("====================================");
      // toast.error(error.response);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col min-h-screen ">
        <Toaster richColors position="top-right" />
        <div className="w-[480px] signup-form px-10 py-10">
          <div className="py-2 flex flex-row items-center justify-between">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Login
            </h2>
            <Link to="/" className="text-blue-600">Home</Link>
          </div>

          <LabelInputContainer className="flex flex-row items-center justify-between">
            <Label htmlFor="firstname">Login as </Label>
            <Select
              className="text-black bg-white"
              onValueChange={(value) => {
                setusertype(value);
              }}
            >
              <SelectTrigger className="w-[180px] text-black bg-white">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="admin" className="hover:bg-slate-200">
                  Admin
                </SelectItem>
                <SelectItem value="referral" className="hover:bg-slate-200">
                  Referral
                </SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="firstname">User name </Label>
            <Input
              id="firstname"
              placeholder="username"
              type="text"
              className="text-black dark:text-white"
              onChange={(e) => {
                setusername(e.target.value);
                setusernameError("");
              }}
            />
            {usernameError != "" && (
              <p className="text-red-600">{usernameError}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Password</Label>
            <Input
              id="lastname"
              placeholder="password"
              type="password"
              onChange={(e) => {
                setpassword(e.target.value);
                setpasswordError("");
              }}
            />
            {passwordError != "" && (
              <p className="text-red-600">{passwordError}</p>
            )}
          </LabelInputContainer>

          {/* button */}
          <button
            className="bg-gradient-to-br relative my-4 group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            onClick={() => {
              handleLogin();
            }}
          >
            Login &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4 ">
            <div className="flex flex-row items-center justify-center">
              <LabelInputContainer>
                <Label htmlFor="firstname">Don&apos;t have an account?</Label>
              </LabelInputContainer>
              <button
                className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                <IconUserCircle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Create one
                </span>
                <BottomGradient />
              </button>
            </div>
          </div>

          {/* button  */}
        </div>
      </div>
    </>
  );
};

export default Login;
