import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "./../../../utils/cn";
import { HoverEffect } from "./../../ui/card-hover-effect";
import { Button } from "./../../ui/button";
import Auth from "./../../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
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

const Subquizzes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // fetchQuizzes();
    // console.log(id);
    handleNavigate();
  }, []);

  const handleNavigate = async () => {
    try {
      const res = await axios({
        method: "post",
        data: {
          module_id: id
        },
        url: "https://server.indephysio.com/chapter/quiz/navigate"
      });

      navigate(res.data.url);
    } catch (error) {
      console.log(error);

      navigate("/");
    }
  };

  const [quizzes, setquizzes] = useState([]);
  const [moduleName, setmoduleName] = useState("");
  const [moduleDescription, setmoduleDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [moduleEditName, setmoduleEditName] = useState("");
  const [moduleEditDescription, setmoduleEditDescription] = useState("");
  const [moduleEditId, setmoduleEditId] = useState("");

  const [moduleDeleteId, setmoduleDeleteId] = useState("");

  const tokenData = Auth();

  const fetchQuizzes = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://server.indephysio.com/modules/" + id
      });
      setquizzes(response.data);
    } catch (error) {}
  };

  const handleDeleteModule = async (id) => {
    console.log("dfgsbd", id);
    setOpenDelete(true);
    setmoduleDeleteId(id);

    // const res = await axios({
    //   method: "post",
    //   url: "https://server.indephysio.com/modules/delete",
    //   data: {
    //     moduleId: id
    //   }
    // });
    // fetchQuizzes();

    // console.log(res.data);
  };

  const handleDeleteConfirm = async () => {
    setOpenDelete(false);
    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/modules/delete",
      data: {
        moduleId: moduleDeleteId
      }
    });

    console.log(res.data);

    fetchQuizzes();
    console.log("deleted");
  };

  const handleModule = async () => {
    console.log(moduleName, moduleDescription);

    const obj = {
      moduleName,
      moduleDescription,
      module_id: id,
      client_id: tokenData.client_id
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/modules/add",
      data: obj
    });

    fetchQuizzes();
    setmoduleName("");
    setmoduleDescription("");
    console.log(res.data);
  };

  const handleEditModule = async (id) => {
    console.log(id);

    let response = await axios({
      method: "get",
      url: "https://server.indephysio.com/modules/data/" + id
    });

    console.log(response.data);
    setmoduleEditId(response.data.id);
    setmoduleEditName(response.data.name);
    setmoduleEditDescription(response.data.description);
    fetchQuizzes();

    setOpen(true);
  };

  const handleEditModuleUpdate = async () => {
    // console.log(moduleEditId, moduleEditName, moduleEditDescription);

    const obj = {
      module_id: moduleEditId,
      module_name: moduleEditName,
      module_description: moduleEditDescription
    };

    const res = await axios({
      method: "post",
      url: "https://server.indephysio.com/modules/update",
      data: obj
    });

    fetchQuizzes();
  };

  const side = "bottom";
  return (
    <div className="my-4 w-full">
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
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* alert */}

      {/* bottom sheet  */}
      <div>
        <Sheet key={side} open={open} onOpenChange={setOpen}>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Update Quiz</SheetTitle>
              <SheetDescription>
                Name and describe your module to create a quiz.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name your Quiz
                </label>
                <input
                  id="name"
                  placeholder="Name your quiz"
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
                  placeholder="Describe the quiz"
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
                  Update Quiz
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      {/* bottom sheet  */}

      <div className="w-full py-4 my-4 flex items-start px-3 justify-center">
        <div className="w-4/5 py-4 my-4 flex items-center px-3 justify-between">
          <div>
            <h1 className="text-black dark:text-white">Quizzes</h1>
          </div>

          <div>
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">Create Quiz</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Create Quiz</SheetTitle>
                  <SheetDescription>
                    Name and describe your module to create a module.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name your Quiz
                    </label>
                    <input
                      id="name"
                      placeholder="Name your quiz"
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
                      placeholder="Describe the quiz"
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
                      Create Quiz
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
            page="subquiz"
            handleDeleteModule={handleDeleteModule}
            handleEditModule={handleEditModule}
          />
        </div>
      </div>
    </div>
  );
};

export default Subquizzes;
