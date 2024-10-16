import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { GlobalInfo } from "./../../../App";

import LanguageIndex from "./languages/index";

import useAuth from "@/hooks/useAuth";
import { ClientContext } from "@/hooks/Clientcontext";
import Consultant from "./../consultant/components/ConsultantFrames";
import Translator from './translator/Translator';

function Dashboard() {
  const navigate = useNavigate();
  const context = useContext(GlobalInfo);

  const { clientDetails } = useContext(ClientContext);

  const auth = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 ">
      <div className="text-start">
        {/* radix card  */}
        {clientDetails && (
          <div>
            {(clientDetails.is_super_admin == 1 ||
              clientDetails.is_tutor == 1) && <LanguageIndex />}

            {clientDetails.is_consultant == 1 &&
              clientDetails.is_super_admin == 0 &&
              clientDetails.is_tutor == 0 &&
              clientDetails.is_financial == 0 &&
              clientDetails.is_translator == 0 && (
                <div className="flex flex-col">
                  <Consultant />
                </div>
              )}
            {clientDetails.is_translator == 1 &&
              clientDetails.is_super_admin == 0 &&
              clientDetails.is_tutor == 0 &&
              clientDetails.is_financial == 0 &&
              clientDetails.is_consultant == 0 && (
                <div className="flex flex-col">
                  <Translator />
                </div>
              )}
          </div>
        )}

        {/* radix card  */}
      </div>
    </div>
  );
}

export default Dashboard;
