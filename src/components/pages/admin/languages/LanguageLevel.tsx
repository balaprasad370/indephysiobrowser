import React, { useLayoutEffect, useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import GridCard from "./../../../ui/gridcard";
import { CheckIcon } from "@radix-ui/react-icons";
import { FaPlus } from "react-icons/fa6";

import axios from "axios";
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

const LanguageLevel = () => {
  const context = useContext(GlobalInfo);
  const [token, settoken] = useState("");
  const [items, setitems] = useState([]);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    settoken(getToken);
    handleGetLevels(getToken);
  }, []);

  const { lang_code } = useParams();
  const navigate = useNavigate();
  const side = "bottom";

  const [levelName, setlevelName] = useState("");
  const [levelDescription, setlevelDescription] = useState("");
  const [levelFile, setlevelFile] = useState("");

  const [levelNameUpdate, setlevelNameUpdate] = useState("");
  const [levelDescriptionUpdate, setlevelDescriptionUpdate] = useState("");
  const [levelFileUpdate, setlevelFileUpdate] = useState("");
  const [levelIdUpdate, setlevelIdUpdate] = useState("");

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isdisableddelete, setisdisableddelete] = useState(true);

  useLayoutEffect(() => {
    if (lang_code == null) {
      navigate("/");
    }
  }, []);

  const handleCreateLevel = async () => {
    let filePath = "";
    if (levelFile != "") {
      filePath = await uploadFile(levelFile);
    }

    const obj = {
      name: levelName,
      description: levelDescription,
      lang_code: lang_code,
      filepath: filePath
    };

    const res = await axios({
      method: "post",
      data: obj,
      url: context.apiEndPoint + "levels/add",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    setlevelFile("");
    handleGetLevels(token);
  };

  const handleGetLevels = async (getToken) => {
    const res = await axios({
      method: "get",
      url: context.apiEndPoint + "levels/" + lang_code,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken
      }
    });

    setitems(res.data);
    console.log(res.data);
  };

  const handleEdit = (data) => {
    setlevelNameUpdate(data.title);
    setlevelDescriptionUpdate(data.description);
    setlevelIdUpdate(data.id);
    setOpenEdit(true);
  };

  const handleDelete = (id) => {
    // alert("this is delete module");
    setlevelIdUpdate(id);
    setisdisableddelete(true);
    setOpenDelete(true);
  };

  const handleUpdateLevel = async () => {
    let filePath = "";
    if (levelFileUpdate != "") {
      filePath = await uploadFile(levelFileUpdate);
    }

    const obj = {
      name: levelNameUpdate,
      description: levelDescriptionUpdate,
      level_id: levelIdUpdate,
      filepath: filePath
    };

    const res = await axios({
      method: "post",
      data: obj,
      url: context.apiEndPoint + "levels/update",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    setlevelFileUpdate("");
    handleGetLevels(token);
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

  const handleDeleteConfirm = async () => {
    const res = await axios({
      method: "delete",
      url: context.apiEndPoint + "levels/" + levelIdUpdate,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    handleGetLevels(token);
  };

  return (
    <>
      <div>
        <div className="w-full flex items-center justify-center">
          <div className="lg:w-3/5 md:w-full sm:w-full flex items-center justify-between">
            <div className="text-start my-4">
              <h2 className="text-black  dark:text-white text-lg font-bold">
                Choose Level
              </h2>
            </div>

            <div>
              <button
                className="flex items-center p-1 pb-2 bg-teal-600 text-white"
                onClick={() => {
                  //   alert("rv");
                  setOpen(!open);
                }}
              >
                <div className="p-1">
                  <FaPlus />
                </div>
                <div className="pr-4">Create new Level</div>
              </button>
            </div>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {items.map((item, i) => (
              <GridCard
                key={i}
                title={item.level_name}
                description={item.level_description}
                header={item.level_name}
                image={context.filesServerUrl + item.level_img}
                link={item.link}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                id={item.level_id}
                //   className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="my-3 w-full text-black dark:text-white">
            <h1>No levels found</h1>
          </div>
        )}
      </div>

      {/* create level  */}
      <div>
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Create Level</SheetTitle>
              <SheetDescription>
                Name and describe your level to create a Level.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name your level
                </label>
                <input
                  id="name"
                  placeholder="Name your Level"
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
                  placeholder="Describe the Level"
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
                  Create Level
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
              <SheetTitle>Update Level</SheetTitle>
              <SheetDescription>
                Name and describe your level to create a Level.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name your level
                </label>
                <input
                  id="name"
                  placeholder="Name your Level"
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
                  onClick={handleUpdateLevel}
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
                This action cannot be undone. This will permanently delete this
                module. <br />
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
                  handleDeleteConfirm();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* delete level  */}
    </>
  );
};

export default LanguageLevel;
