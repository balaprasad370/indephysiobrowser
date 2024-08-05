import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const StudentStatus = ({ student_id }) => {
  const tokenData = useAuth();

  const [studentStatus, setstudentStatus] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/profile/status",
      data: {
        student_id: student_id
      }
    });

    console.log(res.data);

    setloading(false);
    setstudentStatus(res.data);
  };

  return (
    <>
      <div className="my-4">
        <section className="mt-8 align-start my-4 text-white">
          <h2 className="text-2xl font-bold mb-4 text-start text-black dark:text-white">
            Pathway Timeline
          </h2>
          <div className="flex  space-x-4 flex-col w-full relative h-full">
            {loading && (
              <div className="absolute inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                <div className="">Loading...</div>
              </div>
            )}

            {/* status  */}

            <div className="flex flex-row justify-around items-center flex-grow w-full">
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_a1_status
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_a1_status ? "" : "text-slate-400"
                    }
                  >
                    A1 German Level
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_a2_status
                        ? "text-green-400"
                        : "text-slate-400"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_a2_status ? "" : "text-slate-500"
                    }
                  >
                    A2 German Level
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_b1_status
                        ? "text-yellow-400"
                        : "text-slate-400"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_b1_status ? "" : "text-slate-500"
                    }
                  >
                    B1 German Level
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_b2_status
                        ? "text-purple-600"
                        : "text-slate-400"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_b2_status ? "" : "text-slate-500"
                    }
                  >
                    B2 German Level
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_interview_status
                        ? "text-orange-600"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_interview_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Interview process
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_contract_status
                        ? "text-teal-600"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_contract_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Job Contract Level
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_relocation_status
                        ? "text-pink-600"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_relocation_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Relocation process
                  </p>
                </div>
              </div>
            </div>

            <div className="my-4 w-full">
              <hr className="border-dashed border-black dark:border-white border" />
            </div>

            <div className="flex flex-row justify-around items-center w-full">
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_document_status
                        ? "text-amber-600"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_document_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Document Attestation
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_translation_status
                        ? "text-lime-400"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_translation_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Translation of documents
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_application_status
                        ? "text-fuchsia-500"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_application_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Application process
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_evaluation_status
                        ? "text-cyan-400"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_evaluation_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Evaluation process
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_recognition_status
                        ? "text-indigo-300"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_recognition_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Full Recognition
                  </p>
                </div>
              </div>
              <div>
                <div className="lg:min-w-[170px] min-w-[50px] flex items-center flex-col">
                  <FaMapMarkerAlt
                    className={
                      studentStatus.candidate_visa_status
                        ? "text-pink-500"
                        : "text-slate-500"
                    }
                    size={30}
                  />
                  <p
                    className={
                      studentStatus.candidate_visa_status
                        ? ""
                        : "text-slate-500"
                    }
                  >
                    Visa Process
                  </p>
                </div>
              </div>
            </div>

            {/* status  */}
          </div>
        </section>
      </div>
    </>
  );
};

export default StudentStatus;
