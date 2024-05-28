import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "./../../../utils/cn";
import { HoverEffect } from "./../../ui/card-hover-effect";
import { Button } from "./../../ui/button";
import Auth from "./../../../hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "../../ui/sheet.tsx";

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
import { Button } from "../../ui/button";



const Assessment = () => {
  const [quizzes, setquizzes] = useState([]);
  const [moduleName, setmoduleName] = useState("");
  const [moduleDescription, setmoduleDescription] = useState("");
  const [moduleEditName, setmoduleEditName] = useState("");
  const [moduleEditDescription, setmoduleEditDescription] = useState("");
  const [moduleEditId, setmoduleEditId] = useState("");
  const [open, setOpen] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [chapterId, setchapterId] = useState("");

  const tokenData = Auth();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://server.indephysio.com/assessments/all"
      });
      setquizzes(response.data);
    } catch (error) {}
  };

  const handleDeleteModule = async (id) => {
    setOpenDelete(true);
    setchapterId(id);
  };
  const handleDeleteConfirm = async () => {
    setOpenDelete(false);
    try {
      const res = await axios({
        method: "post",
        url: "https://server.indephysio.com/assessments/delete",
        data: {
            assessment_id: chapterId
        }
      });
      console.log(res.data);
      
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }

    fetchQuizzes();

    // console.log(res.data);
  };

  const handleEditModule = async (id) => {
    // console.log(id);

    let response = await axios({
      method: "get",
      url: "https://server.indephysio.com/assessments/" + id
    });

    console.log(response.data);
    setmoduleEditId(response.data.id);
    setmoduleEditName(response.data.name);
    setmoduleEditDescription(response.data.description);

    setOpen(true);
  };

  const handleModule = async () => {
    // console.log(moduleName, moduleDescription);

    const obj = {
        assessment_name: moduleName,
        assessment_description: moduleDescription,
      client_id: tokenData.client_id
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/assessments/add",
      data: obj
    });

    fetchQuizzes();

    setmoduleName("");
    setmoduleDescription("");
    console.log(res.data);
  };

  const handleEditModuleUpdate = async () => {
    console.log(moduleEditId, moduleEditName, moduleEditDescription);

    const obj = {
        assessment_id: moduleEditId,
        assessment_name: moduleEditName,
        assessment_description: moduleEditDescription
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/assessments/update",
      data: obj
    });


    fetchQuizzes();
  };

  const side = "bottom";
  return (
    <div className="my-4 w-full">
      {/* alert */}

      {/* alert  */}

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
              This action cannot be undone. This will permanently delete this
              module.
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

      {/* alert */}

      {/* alert */}

      <div>
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Update Chapter</SheetTitle>
              <SheetDescription>
                Name and describe your module to create a module.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name your Chapter
                </label>
                <input
                  id="name"
                  placeholder="Name your Chapter"
                  value={moduleEditName}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    setmoduleEditName(e.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="describe" className="text-right">
                  Description
                </label>
                <input
                  id="describe"
                  placeholder="Describe the Chapter"
                  value={moduleEditDescription}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => {
                    setmoduleEditDescription(e.target.value);
                  }}
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  onClick={handleEditModuleUpdate}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Update Chapter
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full py-4 my-4 flex items-start px-3 justify-center">
        <div className="w-4/5 py-4 my-4 flex items-center px-3 justify-between">
          <div>
            <h1 className="text-black dark:text-white">Assessments</h1>
          </div>

          <div>
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">Create Chapter</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Create Chapter</SheetTitle>
                  <SheetDescription>
                    Name and describe your module to create a module.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name your Chapter
                    </label>
                    <input
                      id="name"
                      placeholder="Name your Chapter"
                      value={moduleName}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        setmoduleName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="describe" className="text-right">
                      Description
                    </label>
                    <input
                      id="describe"
                      placeholder="Describe the Chapter"
                      value={moduleDescription}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => {
                        setmoduleDescription(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      onClick={handleModule}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Create Chapter
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="w-4/5">
          <HoverEffect
            items={quizzes}
            handleDeleteModule={handleDeleteModule}
            handleEditModule={handleEditModule}
          />
        </div>
      </div>
    </div>
  );
};

export default Assessment;
