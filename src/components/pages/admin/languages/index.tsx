import React, { useEffect, useState, useContext } from "react";
import en from "../../../../assets/en.jpg";
import de from "../../../../assets/de.jpg";
import { TbClipboardCopy } from "react-icons/tb";
import { Link } from "react-router-dom";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import { FaPlus } from "react-icons/fa6";

import { Button } from "./../../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../../../ui/sheet.tsx";
import { GlobalInfo } from "./../../../../App";

import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import GridCard from "./../../../ui/gridcard";
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
} from "../../../ui/alert.tsx";

const LanguageIndex = () => {
  const [languages, setlanguages] = useState([]);
  const context = useContext(GlobalInfo);
  const [token, settoken] = useState(localStorage.getItem("token"));

  const [levelName, setlevelName] = useState("");
  const [levelDescription, setlevelDescription] = useState("");
  const [levelFile, setlevelFile] = useState("");

  const [levelNameUpdate, setlevelNameUpdate] = useState("");
  const [levelDescriptionUpdate, setlevelDescriptionUpdate] = useState("");
  const [levelFileUpdate, setlevelFileUpdate] = useState("");
  const [levelIdUpdate, setlevelIdUpdate] = useState("");
  const [isdisableddelete, setisdisableddelete] = useState(true);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editItem, seteditItem] = useState("");
  const [deleteItem, setdeleteItem] = useState("");

  const side = "bottom";

  useEffect(() => {
    getLanguages();
  }, []);

  const getLanguages = async () => {
    const response = await axios({
      method: "get",
      url: context.apiEndPoint + "languages"
    });

    console.log(response.data);
    setlanguages(response.data);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      context.apiEndPoint + "upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    // console.log(response.data);
    return response.data.filepath;
  };

  const handleCreateLevel = async () => {
    console.log("====================================");
    console.log(levelName, levelDescription, levelFile);
    console.log("====================================");

    try {
      let filepath = "";
      if (levelFile != "") {
        filepath = await uploadFile(levelFile);
      }

      const obj = {
        language_name: levelName,
        language_description: levelDescription,
        language_img: filepath
      };

      const result = await axios({
        method: "post",
        url: context.apiEndPoint + "languages/add",
        data: obj,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      console.log("====================================");
      console.log(result.data);
      console.log("====================================");
      getLanguages();
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };
  const handleUpdateLevel = (data) => {
    seteditItem(data);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    console.log("====================================");
    console.log(editItem);
    console.log("====================================");

    let filepath = "";
    if (levelFileUpdate != "") {
      filepath = await uploadFile(levelFileUpdate);
    }

    const obj = {
      language_name: levelNameUpdate,
      language_description: levelDescriptionUpdate,
      language_img: filepath,
      lang_id: editItem.id
    };

    try {
      const result = await axios({
        method: "post",
        url: context.apiEndPoint + "languages/update",
        data: obj,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      getLanguages();
    } catch (error) {
      // console.log("====================================");
      // console.log(error);
      // console.log("====================================");
    }
  };

  const handleDelete = async () => {
    console.log("====================================");
    console.log(deleteItem);
    console.log("====================================");

    const obj = {
      lang_id: deleteItem
    };

    try {
      const result = await axios({
        method: "post",
        url: context.apiEndPoint + "languages/delete",
        data: obj,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      getLanguages();
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const handleDeleteConfirm = (data) => {
    setdeleteItem(data);
    setOpenDelete(true);
  };

  return (
    <>
      <div className="px-4">
        <div className="w-full flex items-center justify-center">
          <div className="lg:w-3/5 w-full  flex items-center justify-between">
            <div className="text-start my-4">
              <h2 className="text-black  dark:text-white text-lg font-bold">
                Choose Subject
              </h2>
            </div>

            <div>
              <button
                className="flex items-center p-1 pb-2 bg-teal-600 text-white"
                onClick={() => {
                  // //   alert("rv");
                  setOpen(!open);
                }}
              >
                <div className="p-1">
                  <FaPlus />
                </div>
                <div className="pr-4">Create new Subject</div>
              </button>
            </div>
          </div>
        </div>

        {languages.length > 0 ? (
          <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto ">
            {languages.map((item, index) => {
              return (
                <GridCard
                  key={index}
                  title={item.language_name}
                  description={item.language_description}
                  header={item.language_name}
                  image={context.filesServerUrl + item.lang_img}
                  link={"/admin/language/" + item.lang_id}
                  handleDelete={handleDeleteConfirm}
                  handleEdit={handleUpdateLevel}
                  id={item.lang_id}
                  //   className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold text-xl w-full min-h-64">
            No subjects found
          </div>
        )}

        {/* create level  */}
        <div>
          <Sheet key={side} open={open} onOpenChange={setOpen}>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Create Subject</SheetTitle>
                <SheetDescription>
                  Name and describe your Subject to create a Subject.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name your Subject
                  </label>
                  <input
                    id="name"
                    placeholder="Name your Subject"
                    value={levelName}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelName(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="describe" className="text-right">
                    Description
                  </label>
                  <input
                    id="describe"
                    placeholder="Describe the Subject"
                    value={levelDescription}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="upload-img1" className="text-right">
                    Upload Image
                  </label>
                  <input
                    id="upload-img1"
                    type="file"
                    accept="image/*"
                    placeholder="Upload the file"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelFile(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    onClick={handleCreateLevel}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Create Subject
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        {/* create level  */}

        {/* update level  */}
        <div>
          <Sheet key={side} open={openEdit} onOpenChange={setOpenEdit}>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Update Subject</SheetTitle>
                <SheetDescription>
                  Name and describe your Subject to create a Subject.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name your Subject
                  </label>
                  <input
                    id="name"
                    placeholder="Name your Subject"
                    value={levelNameUpdate}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelNameUpdate(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="describe" className="text-right">
                    Description
                  </label>
                  <input
                    id="describe"
                    placeholder="Describe the Level"
                    value={levelDescriptionUpdate}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelDescriptionUpdate(e.target.value);
                    }}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="upload-img" className="text-right">
                    Upload Image
                  </label>
                  <input
                    id="upload-img"
                    type="file"
                    accept="image/*"
                    placeholder="Upload the file"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      setlevelFileUpdate(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    onClick={handleUpdate}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Update Level
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* update level  */}

        {/* delete level  */}

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
                <div>
                  This action cannot be undone. This will permanently delete
                  this module. <br />
                  Type{" "}
                  <strong>
                    {" "}
                    <em>permanently delete</em>
                  </strong>
                  <div className="my-4">
                    <input
                      id="delete"
                      autoComplete="off"
                      autoCapitalize="off"
                      placeholder="Type permanently delete"
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        if (e.target.value == "permanently delete") {
                          setisdisableddelete(false);
                        } else {
                          setisdisableddelete(true);
                        }
                      }}
                    />
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white"
                  disabled={isdisableddelete}
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* delete level  */}
      </div>
    </>
  );
};

export default LanguageIndex;
