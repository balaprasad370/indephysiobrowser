import { useState, useEffect, createContext } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
import { Routes, Route, Link, Navigate } from "react-router-dom";
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
import Chapters from "./components/pages/admin/Chapters";
import AssessmentDetails from "./components/pages/admin/AssessmentDetails";
import CandidateProfile from "./components/pages/admin/CandidateProfile";
import Schedule from "./components/pages/admin/Schedule";
import QuizGenerator from "./components/pages/admin/QuizGenerator";
import IframeQuiz from "./components/pages/iframes/IframeQuiz";
import LanguageLevel from "./components/pages/admin/languages/LanguageLevel";
import LanguageLevelContent from "./components/pages/admin/languages/LanguageLevelContent";
import LanguageLevelChapterContent from "./components/pages/admin/languages/LanguageLevelChapterContent";
import LanguageLevelPackage from "./components/pages/admin/languages/LanguageLevelPackage";
import Candidates from "./components/pages/admin/Candidates";
import Transactions from "./components/pages/admin/Transactions";
import Documents from "./components/pages/admin/Documents";
import Branding from "./components/pages/branding/Branding";
import AddBranding from "./components/pages/branding/AddBranding";
import ViewBranding from "./components/pages/branding/ViewBranding";
import Meet from "./components/pages/admin/Meet";

export const GlobalInfo = createContext();
function App() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("theme");

      if (theme == null || theme == "light") {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        localStorage.setItem("theme", "light");

        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const routeChange = initialRoute();
  const [count, setCount] = useState(0);
  const contextData = {
    filesServerUrl: "https://d2c9u2e33z36pz.cloudfront.net/",
    apiEndPoint: "https://server.indephysio.com/"
    // massimo
    // filesServerUrl: "https://d3nbnikvasv2ex.cloudfront.net/",
    // apiEndPoint: "https://server.massimo.global/"
  };

  return (
    <GlobalInfo.Provider value={contextData}>
      <div className="bg-light dark:bg-neutral-800 min-h-screen h-full">
        <Routes location={routeChange}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" index element={<Login />} />

          <Route path="/admin" element={<AdminSidebar />}>
            <Route index path="dashboard" element={<Admindashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branding/new" element={<AddBranding />} />
            <Route path="branding/view/:brand_id" element={<ViewBranding />} />
            <Route path="chapters" element={<Chapters />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="quiz/sub/:id" element={<Subquizzes />} />
            <Route path="quiz/:id" element={<Quizdetails />} />
            <Route path="quiz/generate" element={<QuizGenerator />} />
            <Route path="students" element={<Students />} />
            <Route path="settings" element={<Settings />} />
            <Route path="meet/join/:room_name" element={<Meet />} />
            <Route path="assessment">
              <Route index element={<Assessment />} />
              <Route path="sub/:id" element={<Subassessments />} />
              <Route path="details/:id" element={<AssessmentDetails />} />
            </Route>
            <Route path="candidate/:id" element={<CandidateProfile />} />
            <Route
              path="candidate/transactions/:id"
              element={<Transactions />}
            />
            <Route path="candidate/documents/:id" element={<Documents />} />

            {/* lnagugages  */}

            <Route path="language" element={<Navigate to="/" />} />
            <Route
              exact
              path="language/:lang_code"
              element={<LanguageLevel />}
            />

            <Route
              path="language/:lang_code/level"
              element={<Navigate to="/admin/language/" />}
            />
            <Route
              path="language/:lang_code/level/:lang_level"
              element={<LanguageLevelPackage />}
            />

            {/* packages  */}
            <Route
              path="language/:lang_code/level/:lang_level/package"
              element={<LanguageLevelContent />}
            />
            <Route
              path="language/:lang_code/level/:lang_level/package/:package_id"
              element={<LanguageLevelContent />}
            />
            {/* packages  */}

            <Route
              path="language/:lang_code/level/:lang_level/package/:package_id/chapter"
              element={<LanguageLevelContent />}
            />
            <Route
              path="language/:lang_code/level/:lang_level/package/:package_id/chapter/:chapter_id"
              element={<LanguageLevelChapterContent />}
            />
            {/* languages  */}

            {/* schedule  */}
            <Route path="schedule" element={<Schedule />} />
          </Route>

          <Route path="/student" element={<StudentSidebar />}>
            <Route index path="dashboard" element={<Studentdashboard />} />
          </Route>

          <Route path="/referral" element={<ReferralSidebar />}>
            <Route path="dashboard" element={<Referraldashboard />} />
          </Route>
        </Routes>
      </div>
    </GlobalInfo.Provider>
  );
}

export default App;
