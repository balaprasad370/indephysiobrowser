import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const Auth = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Access the pathname property of the location object to get the current route
  const currentRoute = location.pathname;

  if (token == null || token == undefined) {
    // Replace the current URL with a new URL

    if (
      currentRoute != "/login" &&
      currentRoute != "/signup" &&
      currentRoute != "/"
    ) {
      window.location.replace("/login");
    }
  } else {
    try {
      const decoded = jwtDecode(token);
      if (new Date().getTime() < new Date(decoded?.exp * 1000).getTime()) {
        if (
          currentRoute == "/login" ||
          currentRoute == "/signup" ||
          currentRoute == "/"
        ) {
          const routeChange = "/" + decoded.usertype + "/" + "dashboard";
          // console.log(routeChange);
          window.location.replace(routeChange);
          return;
        }
        return decoded;
      } else {
        localStorage.removeItem("token");
        window.location.replace("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.replace("/login");
    }
  }
};

export default Auth;
