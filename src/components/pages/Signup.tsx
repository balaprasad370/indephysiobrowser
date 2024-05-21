import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

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

import useAuth from "../../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const tokenData = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [userType, setUserType] = useState("student");

  const [firstNameError, setfirstNameError] = useState("");
  const [emailError, setemailError] = useState("");
  const [mobileError, setmobileError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [cnfpasswordError, setcnfpasswordError] = useState("");

  function validateEmail(email) {
    // Regular expression for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleSubmit = async () => {
    setfirstNameError("");
    setemailError("");
    setmobileError("");
    setpasswordError("");
    setcnfpasswordError("");

    if (firstName.length <= 0) {
      setfirstNameError("First Name is required");
    }
    if (email.length <= 0) {
      setemailError("Email is required");
    }
    if (mobile.length <= 0) {
      setmobileError("Mobile is required");
    }
    if (password.length <= 0) {
      setpasswordError("Password is required");
    }
    if (cnfPassword.length <= 0) {
      setcnfpasswordError("Confirm Password is required");
    }
    if (password.trim() !== cnfPassword.trim()) {
      setcnfpasswordError("Confirm password should match password");
    }
    if (password.trim().length < 6) {
      setpasswordError("Password should be atleast 6 characters ");
    }

    if (!validateEmail(email)) {
      setemailError("Email should be valid");
    }

    if (
      firstName.length <= 0 ||
      email.length <= 0 ||
      mobile.length <= 0 ||
      password.length <= 0 ||
      cnfPassword.length <= 0 ||
      password.trim() !== cnfPassword.trim() ||
      password.trim().length < 6 ||
      !validateEmail(email)
    ) {
      return;
    }

    const obj = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      mobile: mobile,
      password: password,
      usertype: userType
    };

    // console.log(obj);

    try {
      const response = await axios({
        method: "post",
        url: `https://server.indephysio.com/signup`,
        data: obj
      });

      //   console.log(response.data);
      if (response.data.message) {
        toast.success("Account has been created successfully", {
          description: "Verification has been sent to " + email
        });
        setTimeout(() => {
          navigate("/login");
        }, 6000);
      }
    } catch (error) {
      //   console.log(error);

      toast.error(
        `Something went wrong Contact Us <a href='mailto:support@physioplusnetwork.com'>support@physioplusnetwork.com</a>`
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col min-h-screen">
        <Toaster richColors position="top-right" />
        <div className="w-[480px] signup-form px-10 py-10">
          <div className="py-2 flex flex-row items-center justify-between">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Signup
            </h2>
            <button
              className="bg-black"
              onClick={() => {
                navigate("/");
              }}
              style={{
                color: "#99c3ff"
              }}
            >
              Home
            </button>
          </div>
          <LabelInputContainer className="flex flex-row items-center justify-between">
            <Label htmlFor="firstname">Signup as </Label>
            <Select
              className="text-black bg-white"
              onValueChange={(value) => {
                setUserType(value);
              }}
            >
              <SelectTrigger className="w-[180px] text-black bg-white">
                <SelectValue placeholder="Student" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="admin" className="hover:bg-slate-200">
                  Admin
                </SelectItem>
                <SelectItem value="student" className="hover:bg-slate-200">
                  Student
                </SelectItem>
                <SelectItem value="referral" className="hover:bg-slate-200">
                  Referral
                </SelectItem>
              </SelectContent>
            </Select>
          </LabelInputContainer>

          <div className="flex flex-row">
            <LabelInputContainer className="pr-1">
              <Label htmlFor="firstname">First name *</Label>
              <Input
                id="firstname"
                placeholder="First name"
                value={firstName}
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setfirstNameError("");
                }}
              />
              {firstNameError != "" && (
                <p className="text-red-600">{firstNameError}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="firstname">Last name</Label>
              <Input
                id="firstname"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                type="text"
              />
            </LabelInputContainer>
          </div>

          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setemailError("");
              }}
              type="email"
            />
            {emailError != "" && <p className="text-red-600">{emailError}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="firstname">Mobile number</Label>
            <Input
              id="firstname"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                setmobileError("");
              }}
              type="text"
            />
            {mobileError != "" && <p className="text-red-600">{mobileError}</p>}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Password</Label>
            <Input
              id="lastname"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setpasswordError("");
              }}
              type="password"
            />
            {passwordError != "" && (
              <p className="text-red-600">{passwordError}</p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastname">Confirm Password</Label>
            <Input
              id="lastname"
              placeholder="confirm password"
              value={cnfPassword}
              onChange={(e) => {
                setCnfPassword(e.target.value);
                setcnfpasswordError("");
              }}
              type="password"
            />
            {cnfpasswordError != "" && (
              <p className="text-red-600">{cnfpasswordError}</p>
            )}
          </LabelInputContainer>

          {/* button */}
          <button
            className=" bg-gradient-to-br relative my-4 group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            Signup &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4 ">
            <div className="flex flex-row items-center justify-center">
              <LabelInputContainer>
                <Label htmlFor="firstname">Already have an account?</Label>
              </LabelInputContainer>
              <button
                className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <IconUserCircle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Login
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

export default Signup;

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
