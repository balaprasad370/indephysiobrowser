// ClientContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
export const ClientContext = createContext();

import { GlobalInfo } from "./../App";

export const ClientProvider = ({ children }) => {
  const [clientDetails, setClientDetails] = useState(null);
  const [theme, setTheme] = useState("light"); // Example theme state

  const {apiEndPoint} = useContext(GlobalInfo);

  // Function to fetch client details
  const fetchClientDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Replace with your token logic

      if(token == null || token == undefined){
        return;
      }

      const response = await axios.get(`${apiEndPoint}api/v1/client/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientDetails(response.data); // Update state with client details
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  // Fetch client details when component mounts
  useEffect(() => {
    fetchClientDetails();
  }, []);

  const contextData = {
    theme,
    setTheme,
    filesServerUrl: "https://d2c9u2e33z36pz.cloudfront.net/",
    apiEndPoint: apiEndPoint,
    liveclassServerUrl: "https://d3kpi6hpyesigd.cloudfront.net/",
    clientDetails,
  };

  return (
    <ClientContext.Provider value={contextData}>
      {children}
    </ClientContext.Provider>
  );
};
