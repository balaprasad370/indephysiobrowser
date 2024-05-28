import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { CardStack } from "./components/ui/card-stack";
import { AnimatedTooltip } from "./components/ui/animated-tooltip";
import { cn } from "./utils/cn";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import Admindashboard from "./components/pages/admin/Admindashboard";
import Studentdashboard from "./components/pages/student/Studentdashboard";
import Referraldashboard from "./components/pages/referral/Referraldashboard";
import initialRoute from "./hooks/initialRoute";
import AdminSidebar from "./partials/AdminSidebar";
import StudentSidebar from "./partials/StudentSidebar";
import ReferralSidebar from "./partials/ReferralSidebar";
import Quiz from "./components/pages/admin/Quiz";
import Quizdetails from "./components/pages/admin/Quizdetails";
import Assessment from "./components/pages/admin/Assessment";
import Students from "./components/pages/admin/Students";
import Settings from "./components/pages/admin/Settings";
import Subquizzes from "./components/pages/admin/Subquizzes";
import Subassessments from "./components/pages/admin/Subassessments";
import Chapters from './components/pages/admin/Chapters';

function App() {
  // window.ipcRenderer.on("main-process-message", (messgae, data) => {
  //   console.log(data, "vegh");
  // });

  const routeChange = initialRoute();
  const [count, setCount] = useState(0);
  return (
    <div className="bg-light dark:bg-black min-h-screen">
      <Routes location={routeChange}>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" index element={<Login />} />

        <Route path="/admin" element={<AdminSidebar />}>
          <Route index path="dashboard" element={<Admindashboard />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/sub/:id" element={<Subquizzes />} />
          <Route path="quiz/:id" element={<Quizdetails />} />
          <Route path="students" element={<Students />} />
          <Route path="settings" element={<Settings />} />
          <Route path="assessment">
            <Route index element={<Assessment />} />
            <Route path="sub/:id" element={<Subassessments />} />
          </Route>
        </Route>

        <Route path="/student" element={<StudentSidebar />}>
          <Route index path="dashboard" element={<Studentdashboard />} />
        </Route>

        <Route path="/referral" element={<ReferralSidebar />}>
          <Route path="dashboard" element={<Referraldashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
