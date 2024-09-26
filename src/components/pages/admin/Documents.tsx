import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DisplayFiles from "./admincomponents/DisplayFiles";
import { IoMdClose } from "react-icons/io";
import { GlobalInfo } from "./../../../App";
import SuperfastDocuments from "./documents/SuperfastDocuments";
import ExpressDocuments from "./documents/ExpressDocuments";
import ProfessionalDocuments from "./documents/ProfessionalDocuments";
import UGFinals from "./documents/UGFinals";
import UGDreamers from "./documents/UGDreamers";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../../ui/alert.tsx";

const Documents = () => {
  const { id } = useParams();
  const context = useContext(GlobalInfo);
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [documents, setdocuments] = useState([]);
  const [open, setopen] = useState(false);
  const [openConfirm, setopenConfirm] = useState(false);
  const [currentStatus, setcurrentStatus] = useState("pending");
  const [currentFile, setcurrentFile] = useState({});
  const [userData, setuserData] = useState({});

  //   console.log(id);

  const getDocuments = async () => {
    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/getdocuments",
        data: {
          student_id: id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //   console.log(res.data);
      setdocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/getDetails",
        data: {
          student_id: id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //   console.log(response.data);
      setuserData(response.data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  useEffect(() => {
    getDocuments();
    getData();
  }, []);

  const handleUpdateDocument = async () => {
    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/updateDocument",
        data: {
          document_id: currentFile.doc_id,
          status: currentStatus
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //   console.log(res.data);
      // getDocuments();
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = (file) => {
    setopen(true);
    setcurrentFile(file);
    setcurrentStatus("accept");
  };

  const handleReject = (file) => {
    setopen(true);
    setcurrentFile(file);
    setcurrentStatus("reject");
  };

  const handleUpdateStatus = async (val) => {
    console.log(val);

    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/updateDocumentStatus",
        data: {
          student_id: id,
          status: val
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //   console.log(res.data);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const renderPackageDocuments = () => {
    switch (userData.package) {
      case "Superfast":
        return (
          <SuperfastDocuments
            studentDetails={userData}
            student_id={id}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case "Express":
        return (
          <ExpressDocuments
            studentDetails={userData}
            student_id={id}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case "Professional":
        return (
          <ProfessionalDocuments
            studentDetails={userData}
            student_id={id}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case "UG Finals":
        return (
          <UGFinals
            studentDetails={userData}
            student_id={id}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case "UG Dreamers":
        return (
          <UGDreamers
            studentDetails={userData}
            student_id={id}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      default:
        return <div>No package found</div>;
    }
  };

  return (
    <>
      <div className="text-black dark:text-white">
        <div className="flex justify-between items-center w-full px-10 py-4">
          <div>
            <h2 className="font-bold capitalize">
              {userData.first_name} ||{" "}
              {userData.package == "" ? "No package found" : userData.package}{" "}
              ||{" "}
              <span
                className={
                  userData.document_status == 2
                    ? "text-teal-600"
                    : "text-red-600"
                }
              >
                {userData.document_status == 2
                  ? "Eligible"
                  : "Not eligible now"}
              </span>
            </h2>
          </div>
          <button
            disabled={userData.package == "" ? true : false}
            className="bg-teal-600 text-white p-2 disabled:opacity-50"
            onClick={setopenConfirm}
          >
            Eligible
          </button>
        </div>
        {/* {documents.length > 0 ? (
          <DisplayFiles
            files={documents}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ) : (
          <div>No files found</div>
        )}
         */}

        <div className="px-2 md:px-10">
          {userData.package == ""
            ? "No package found sdv"
            : renderPackageDocuments()}
        </div>
      </div>

      {/* alert  */}

      <AlertDialog className="relative" open={open} onOpenChange={setopen}>
        <AlertDialogTrigger
          asChild
          className="absolute right-0 top-0"
        ></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to update this action?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleUpdateDocument();
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* alert */}

      {/* alert  */}

      <AlertDialog
        className="relative"
        open={openConfirm}
        onOpenChange={setopenConfirm}
      >
        <AlertDialogTrigger
          asChild
          className="absolute right-0 top-0"
        ></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <div>
                <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
              </div>
              <div>
                <button onClick={() => setopenConfirm(false)}>
                  <IoMdClose />
                </button>
              </div>
            </div>
            <AlertDialogDescription>
              Are you sure he/she is eligible for{" "}
              <span className="font-bold">{userData.package}</span> package?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-600 text-white border-none"
              onClick={() => {
                handleUpdateStatus("reject");
              }}
            >
              Not now
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleUpdateStatus("accept");
              }}
            >
              Yes, Eligible
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* alert */}
    </>
  );
};

export default Documents;
