import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import GridCard from "./../../../ui/gridcard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Translations = () => {
  const { student_id } = useParams();
  const navigate = useNavigate();

  const context = useContext(GlobalInfo);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"left" | "right" | "top" | "bottom">(
    "bottom"
  );

  const [subdocumentLoading, setSubdocumentLoading] = useState(false);
  const [subdocuments, setSubdocuments] = useState([]);

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setTranslations(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubdocuments = async (selectedData: any) => {
    setSubdocumentLoading(true);
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/student/translations/subdocuments/${student_id}/${selectedData.doc_cat_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      setSubdocuments(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSubdocumentLoading(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex justify-center items-center my-4">
          <div className="w-10/12">
            <h1 className="text-2xl text-start font-bold text-black dark:text-white">
              Documents
            </h1>
          </div>
        </div>
        {loading ? (
          <p className="text-center  font-bold text-2xl text-black dark:text-white">
            Loading...
          </p>
        ) : (
          <div className="w-full">
            <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {translations.map((translation, index) => (
                <div key={index} className="w-full flex ">
                  <div
                    className={`cursor-pointer ${
                      selectedTranslation === translation
                        ? "border-4 border-blue-500 rounded-xl"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedTranslation(translation);
                      setOpen(true);
                      fetchSubdocuments(translation);
                    }}
                  >
                    <GridCard
                      className="w-full min-h-[18rem] min-w-[18rem]"
                      title={translation.document_category_name}
                      description={translation.document_category_description}
                      image={translation.document_category_image}
                      editable={false}
                      deletable={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show related documents  */}
        <div>
          {selectedTranslation && (
            <Sheet key={side} open={open} onOpenChange={setOpen}>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">
                    {selectedTranslation.document_category_name}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedTranslation.document_category_description}
                  </SheetDescription>
                </SheetHeader>

                <div className="w-full h-full min-h-[30rem] overflow-y-auto">
                  {subdocumentLoading ? (
                    <p className="text-center  font-bold text-2xl text-black dark:text-white">
                      Loading...
                    </p>
                  ) : (
                    <div className="w-full h-[30rem]  overflow-y-auto p-4">
                      <div className="grid md:auto-rows-[18rem] h-full grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        {subdocuments.length > 0 &&
                          subdocuments.map((subdocument, index) => (
                            <div
                              key={index}
                              className="cursor-pointer"
                              onClick={() => {
                                console.log(subdocument);
                                navigate(
                                  `/admin/candidate/translations/${student_id}/documents/${selectedTranslation.doc_cat_id}/${subdocument.translation_doc_id}`
                                );
                              }}
                            >
                              <GridCard
                                className="w-full min-h-[10rem] min-w-[18rem]"
                                title={subdocument.document_name}
                                description={subdocument.document_description}
                                image={subdocument.document_image}
                                editable={false}
                                deletable={false}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      //   onClick={handleCreateLevel}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Create Level
                    </Button>
                  </SheetClose>
                </SheetFooter> */}
              </SheetContent>
            </Sheet>
          )}
        </div>
        {/* Show related documents  */}
      </div>
    </>
  );
};

export default Translations;
