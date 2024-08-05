import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdModeEditOutline } from "react-icons/md";

import { EditText } from "react-edit-text";
import { useParams } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../../../../ui/sheet.tsx";
import { Button } from "../../../../ui/button";

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
} from "../../../../ui/alert.tsx";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../../ui/select.tsx";
import { MdDeleteOutline } from "react-icons/md";

const ContentDataFlashcard = ({ id }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [items, setitems] = useState([]);
  const [flashMetaData, setflashMetaData] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [prompt, setprompt] = useState("");
  const { chapter_id } = useParams();
  const side = "left";
  const [openDelete, setOpenDelete] = useState(false);
  const [currentDeleteId, setcurrentDeleteId] = useState(null);

  const [addtype, setaddtype] = useState("");

  const theme = document.getElementsByTagName("html")[0].getAttribute("class");
  useEffect(() => {
    getFlashCard();
    getFlashCardMetaData();
  }, [id]);

  const getFlashCard = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://server.indephysio.com/flashcard/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      setitems(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFlashCardMetaData = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://server.indephysio.com/flashcard/metadata/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      setflashMetaData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddFlashcard = async () => {
    const obj = {
      flash_id: id,
      chapter_id: chapter_id
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/flashcard/add/question",
      data: obj,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    console.log(res.data);
    getFlashCard();
  };

  const handleUpdateData = async (flash_question_id, d) => {
    const { name, value } = d;

    const obj = {
      flash_question_id: flash_question_id,
      column: name,
      value: value
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/flashcard/update/question",
      data: obj,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    console.log(res.data);
  };

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    // console.log(prompt);

    setloading(true);

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/flashcard/generate",
      data: {
        text: prompt,
        chapter_id: chapter_id,
        flash_id: id
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    // console.log(res.data);
    getFlashCard();
    setloading(false);

    setOpen(false);
    console.log(res.data);
  };

  const handleDelete = (flash_question_id) => {
    setcurrentDeleteId(flash_question_id);

    setOpenDelete(true);
  };

  const handleDeleteConfirm = async () => {
    console.log(currentDeleteId);

    const res = await axios({
      method: "delete",
      url: "https://server.indephysio.com/flashcard/" + currentDeleteId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    console.log(res.data);
    getFlashCard();
  };

  return (
    <>
      <div className="my-4 quiz-details">
        <div className="flex items-center justify-between px-2 text-black dark:text-white">
          <div className="text-start">
            <h1>{flashMetaData.flashcard_name}</h1>
          </div>
          <div>
            <Select
              className="text-black bg-white"
              value={addtype}
              onValueChange={(value) => {
                if (value == "addmanual") {
                  handleAddFlashcard();
                } else if (value == "generate") {
                  setOpen(true);
                }
                setaddtype("");
              }}
            >
              <SelectTrigger className="w-[180px] text-black bg-white">
                <SelectValue placeholder="Add Flashcard" />
              </SelectTrigger>
              <SelectContent className="text-black bg-white">
                <SelectItem value="addmanual" className="hover:bg-slate-200">
                  Add Flash Card
                </SelectItem>
                <SelectItem value="generate" className="hover:bg-slate-200">
                  Generate Flashcards
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <div key={index} className=" p-2 text-black dark:text-white">
                  <div className="w-full flex my-2  border-4 border-dashed border-teal-300 px-3 rounded-lg relative">
                    <div className="absolute right-2 top-2 bg-slate-200 dark:bg-teal-900 rounded-lg p-1 cursor-pointer">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(item.flash_question_id);
                        }}
                      >
                        <MdDeleteOutline size={20} />
                      </div>
                    </div>
                    <div className="w-2/4 min-h-[7rem] border border-dashed border-slate-700 my-4 rounded-lg mx-2 ">
                      <div className="h-1/12 text-start pl-2">Front side </div>
                      <div className="items-center justify-center flex h-full h-11/12 px-2 pb-4">
                        <EditText
                          name={"flash_question"}
                          defaultValue={item.flash_question}
                          editButtonProps={{
                            style: {
                              width: 16,
                              backgroundColor:
                                theme == "dark" ? "inherit" : "inherit",
                              color: theme == "dark" ? "inherit" : "inherit"
                            }
                          }}
                          style={{
                            fontSize: "16px",
                            color: theme == "dark" ? "inherit" : "inherit",
                            backgroundColor:
                              theme == "dark" ? "inherit" : "inherit"
                          }}
                          showEditButton
                          editButtonContent={
                            <div className="text-black dark:text-white">
                              {<MdModeEditOutline />}
                            </div>
                          }
                          onSave={(d) => {
                            // console.log(d);
                            handleUpdateData(item.flash_question_id, d);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-2/4 min-h-[7rem] border border-dashed border-slate-700 my-4 rounded-lg    pb-4">
                      <div className="h-1/12 text-start pl-2">Back side </div>
                      <div className="items-center justify-center flex h-full h-11/12">
                        <div>
                          <EditText
                            name={"flash_answer"}
                            defaultValue={item.flash_answer}
                            editButtonProps={{
                              style: {
                                width: 16,
                                backgroundColor:
                                  theme == "dark" ? "inherit" : "inherit",
                                color: theme == "dark" ? "inherit" : "inherit"
                              }
                            }}
                            style={{
                              fontSize: "16px",
                              color: theme == "dark" ? "inherit" : "inherit",
                              backgroundColor:
                                theme == "dark" ? "inherit" : "inherit"
                            }}
                            showEditButton
                            editButtonContent={
                              <div className="text-black dark:text-white">
                                {<MdModeEditOutline />}
                              </div>
                            }
                            onSave={(d) => {
                              // console.log(d);
                              handleUpdateData(item.flash_question_id, d);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div>
          <div>
            <Sheet key={side} open={open} onOpenChange={setOpen}>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Generate content</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 text-start items-center gap-0">
                    <label htmlFor="describe" className="text-left my-3">
                      Describe
                    </label>
                    <textarea
                      id="describe"
                      rows={10}
                      defaultValue={prompt}
                      placeholder={`Write a prompt to generate the content \nEg : Generate 10 questions on German accusative prepositions`}
                      className="col-span-3 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        setprompt(e.target.value);
                      }}
                    ></textarea>
                  </div>

                  <div>
                    {loading && <div>Content generating...{loading}</div>}
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      disabled={loading ? true : false}
                      onClick={handleGenerateContent}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Generate Flash cards
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* delete contnent  */}

        <div>
          <AlertDialog
            className="relative"
            open={openDelete}
            onOpenChange={setOpenDelete}
          >
            <AlertDialogTrigger
              asChild
              className="absolute right-0 top-0"
            ></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this module.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDeleteConfirm();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* delete contnent  */}
      </div>
    </>
  );
};

export default ContentDataFlashcard;
