import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { IconUpload, IconExternalLink } from "@tabler/icons-react";
import { MdCancel } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

const UGFinals = ({ studentDetails, student_id, onAccept, onReject }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const filesServerUrl = "https://d2c9u2e33z36pz.cloudfront.net/";

  const [documents, setDocuments] = useState({});

  useEffect(() => {
    getDocuments();
  }, [studentDetails]);

  const getDocuments = async () => {
    const response = await axios({
      method: "get",
      url:
        "https://server.indephysio.com/admin/superfast/get-documents/" +
        student_id,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
    // setDocuments(response.data)

    const _documents = {};
    response.data.map((doc) => {
      if (doc.document_type === "thirdyearmarksheet") {
        _documents.thirdyearmarksheet = { ...doc };
      }
    });

    console.log("====================================");
    console.log(_documents);
    console.log("====================================");

    setDocuments(_documents);
  };

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios({
        method: "post",
        url: "https://server.indephysio.com/upload/image",
        data: formData
      });
      console.log(response.data);

      return response.data.filepath;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleUpload = async (document_type, file) => {
    console.log("upload");

    const filepath = await uploadDocument(file);

    try {
      const response = await axios({
        method: "post",
        url: "https://server.indephysio.com/student/superfast/upload-document",
        data: {
          document_type: document_type,
          document_name: file.name,
          document_path: filepath
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      getDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-start">
        <p>Choosen Pathway :</p>
        <p className="px-4 font-semibold">{studentDetails.package}</p>
      </div>

      <div className="my-4 flex w-full items-center justify-start">
        <p>Required documents </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[{ name: "thirdyearmarksheet", label: "Third Year Marksheet" }].map(
          (document, index) => (
            <div key={index}>
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{document.label}</CardTitle>

                    {documents[document.name]?.status == "pending" && (
                      <CardTitle className="text-sm text-yellow-500">
                        {documents[document.name]?.status}
                      </CardTitle>
                    )}

                    {documents[document.name]?.status == "completed" && (
                      <CardTitle className="text-sm font-bold text-green-600">
                        {documents[document.name]?.status}
                      </CardTitle>
                    )}

                    {documents[document.name]?.status == "rejected" && (
                      <CardTitle className="text-sm text-red-500">
                        {documents[document.name]?.status}
                      </CardTitle>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="max-h-[220px] min-h-[200px] w-full">
                  {documents[document.name]?.document_path &&
                  documents[document.name]?.document_path.includes(".pdf") ? (
                    <div className="flex items-center justify-center pb-4">
                      <img
                        className="h-[120px] w-full object-contain"
                        src={
                          "https://d2c9u2e33z36pz.cloudfront.net/uploads/1727269945pdf.png"
                        }
                        alt={document.name}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center pb-4">
                      <img
                        className="h-[120px] w-full object-contain"
                        src={
                          filesServerUrl +
                          documents[document.name]?.document_path
                        }
                        alt={document.name}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-start pb-4">
                    <h2 className="text-sm text-muted-foreground">
                      {documents[document.name]?.document_name.length > 20
                        ? documents[document.name]?.document_name.substring(
                            0,
                            20
                          ) + "..."
                        : documents[document.name]?.document_name}
                    </h2>
                  </div>

                  <div className="flex w-full items-center justify-between">
                      <Button onClick={() => onAccept(documents[document.name])}>
                      <FaCircleCheck size={20} color="green" />
                    </Button>

                    <Button
                      className="text-black"
                      onClick={() =>
                        window.open(
                          filesServerUrl +
                            documents[document.name]?.document_path,
                          "_blank"
                        )
                      }
                    >
                      <IconExternalLink className="mr-2" size={16} />
                      Open
                    </Button>

                    <Button onClick={() => onReject(documents[document.name])}>
                      <MdCancel size={20} color="red" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UGFinals;
