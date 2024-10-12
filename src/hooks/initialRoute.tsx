import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const initialRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // const getClientDetails = async () => {
  //   if (token == null || token == undefined) {
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(
  //       `https://server.indephysio.com/api/v1/client/details`,
  //       {
  //         headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     }
  //   );
  //   if(response.data.is_consultant == true){
  //     return "/consultant/dashboard";
  //   }
  //   } catch (error) {
  //     console.log("====================================");
  //     console.log(error);
  //     console.log("====================================");
  //   }
  // };
  // getClientDetails();

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
          // return routeChange;
          // const routeChange = "/admin/dashboard";
          // window.location.replace(routeChange);
          return routeChange;
        }
        // console.log(currentRoute);

        // return decoded;
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

export default initialRoute;
