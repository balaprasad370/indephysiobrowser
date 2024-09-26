import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDragMove2Fill } from "react-icons/ri";
import ContentList from "./../admincomponents/ContentList";
import ContentData from "./../admincomponents/ContentData";
import moment from "moment";

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
import { Button } from "../../../ui/button";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "../../../ui/contextmenu.tsx";

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
import { GlobalInfo } from "./../../../../App";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../ui/select.tsx";

const LanguageLevelChapterContent = () => {
  const [items, setitems] = useState([]);
  const [token, settoken] = useState("");
  const context = useContext(GlobalInfo);

  const { chapter_id, package_id } = useParams();
  const [addtype, setaddtype] = useState("");

  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [editContentData, seteditContentData] = useState({});
  const [open, setOpen] = useState(false);
  const side = "top";

  const [DeleteContentalert, setDeleteContentalert] = useState(false);
  const [deleteContentData, setdeleteContentData] = useState("");

  const [currentData, setcurrentData] = useState({});

  const [currentType, setcurrentType] = useState("");
  const [eventsSchedule, seteventsSchedule] = useState([]);

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    settoken(getToken);

    getAllChapterContent(getToken);
  }, []);

  const getAllChapterContent = async (getToken) => {
    const res = await axios({
      method: "get",
      url: context.apiEndPoint + "chapter/v1/admin/" + chapter_id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken
      }
    });

    setitems(res.data);
    // console.log("dcs", res.data);
  };

  // Helper functions for reordering and moving items
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    // console.log(source, destination, droppableSource, droppableDestination);

    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    // const [removed] = sourceClone.splice(droppableSource.index, 1);
    const [removed] = sourceClone.slice(
      droppableSource.index - 1000,
      droppableSource.index - 1000 + 1
    );
    destClone.splice(droppableDestination.index, 0, removed);

    sourceClone.splice(droppableSource.index - 1000, 1);

    return {
      droppable1:
        droppableSource.droppableId === "droppable1" ? sourceClone : destClone,
      droppable2:
        droppableSource.droppableId === "droppable1" ? destClone : sourceClone
    };
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    try {
      // Restrict items in the left list from being dragged to the right list
      if (
        source.droppableId === "droppable1" &&
        destination.droppableId === "droppable2"
      ) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        // Reordering within the same list

        if (destination.droppableId == "droppable2") {
          return;
        }
        const reorderData = reorder(
          source.droppableId === "droppable1" ? items : eventsSchedule,
          source.index,
          destination.index
        );

        if (source.droppableId === "droppable1") {
          setitems(reorderData);
        } else {
          seteventsSchedule(reorderData);
        }

        const data = [];
        reorderData.forEach((element, index) => {
          // console.log(element);

          const obj = {
            type: element.type,
            client_id: element.client_id,
            index: index + 1
          };

          if (element.type == "assessment") {
            obj.id = element.id;
          }
          if (element.type == "flashcard") {
            obj.id = element.flash_id;
          }
          if (element.type == "schedule") {
            obj.id = element.schedule_id;
            obj.chapter_id = chapter_id;
            const obj1 = { ...obj, ...element, arrangeType: "same" };
            data.push(obj1);
            return;
          }
          if (element.type == "reading_material") {
            obj.id = element.read_id;
          }
          if (element.type == "quiz") {
            obj.id = element.id;
            obj.client_id = element.module_client_id;
          }

          data.push(obj);
        });

        // console.log(data);
        console.log("====================================");
        console.log("fgrtgrtgertg", data);
        console.log("====================================");
        updateOrder(data);
      } else {
        // Moving between lists
        const result = move(
          source.droppableId === "droppable1" ? items : eventsSchedule,
          source.droppableId === "droppable1" ? eventsSchedule : items,
          source,
          destination
        );

        setitems(result.droppable1);

        const _sourcedroppableRemove = result.droppable2;

        seteventsSchedule(_sourcedroppableRemove);

        const data = [];
        result.droppable1.forEach((element, index) => {
          // console.log(element);

          const obj = {
            type: element.type,
            client_id: element.client_id,
            index: index + 1
          };

          if (element.type == "assessment") {
            obj.id = element.id;
          }
          if (element.type == "flashcard") {
            obj.id = element.flash_id;
          }
          if (element.type == "schedule") {
            obj.id = element.schedule_id;
            obj.chapter_id = chapter_id;
            const obj1 = { ...obj, ...element, arrangeType: "between" };
            data.push(obj1);
            return;
          }
          if (element.type == "reading_material") {
            obj.id = element.read_id;
          }
          if (element.type == "quiz") {
            obj.id = element.id;
            obj.client_id = element.module_client_id;
          }

          data.push(obj);
        });

        console.log("====================================");
        console.log("fg", data);
        console.log("====================================");
        // console.log(data);
        updateOrder(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrder = async (data) => {

    try {
      const res = await axios({
        method: "post",
        data: {
          items: data
        },
        url: context.apiEndPoint + "chapter/v1/admin/rearrange",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      getAllChapterContent(token);
    } catch (error) {
      getAllChapterContent(token);
      console.log(error);
    }
  };

  const handleAddChapterContent = async (val) => {
    if (val == "schedule") {
      getEventSchedule();
      return;
    }

    const obj = {
      chapter_id: chapter_id,
      order_id: items.length,
      type: val
    };

    try {
      const res = await axios({
        method: "post",
        data: obj,
        url: context.apiEndPoint + "chapters/v1/admin/add",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);
      getAllChapterContent(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) document.body.style.pointerEvents = "all";
    if (DeleteContentalert) document.body.style.pointerEvents = "all";
  }, [open, DeleteContentalert]);

  const handleDeleteList = async () => {
    const data = {
      type: deleteContentData.type,
      id: deleteContentData.id
    };

    try {
      const res = await axios({
        method: "post",
        data: data,
        url: context.apiEndPoint + "chapters/v1/admin/delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);
      if (deleteContentData.type == "schedule") {
        getEventSchedule();
      }
      setcurrentData("");
      getAllChapterContent(token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = async () => {
    const data = {
      title: title,
      description: description,
      type: editContentData.type,
      id: editContentData.id
    };

    try {
      const res = await axios({
        method: "post",
        data: data,
        url: context.apiEndPoint + "chapters/v1/admin/update",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);
      setcurrentData("");
      getAllChapterContent(token);
    } catch (error) {
      console.log(error);
    }
  };

  const getEventSchedule = async () => {
    try {
      const obj = {
        package_id: package_id
      };
      const res = await axios({
        method: "post",
        data: obj,
        url: context.apiEndPoint + "admin/schedule/arrangeDynaminc",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      seteventsSchedule(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex items-center justify-between  w-full px-4">
            <div className="text-black dark:text-white">
              <h2 className="font-bold text-lg">Chapter Contents</h2>
            </div>

            <div className="px-3">
              <Select
                className="text-black bg-white"
                value={addtype}
                onValueChange={(value) => {
                  handleAddChapterContent(value);
                  setaddtype("");
                  setcurrentType(value);
                }}
              >
                <SelectTrigger className="w-[180px] text-black bg-white">
                  <SelectValue placeholder="Add Item" />
                </SelectTrigger>
                <SelectContent className="text-black bg-white">
                  <SelectItem value="flashcard" className="hover:bg-slate-200">
                    Add Flash Card
                  </SelectItem>
                  <SelectItem value="assessment" className="hover:bg-slate-200">
                    Assessment
                  </SelectItem>
                  <SelectItem value="reading" className="hover:bg-slate-200">
                    Reading Material
                  </SelectItem>
                  <SelectItem value="quiz" className="hover:bg-slate-200">
                    Quiz
                  </SelectItem>
                  <SelectItem value="schedule" className="hover:bg-slate-200">
                    Live class
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-even items-start flex-row h-full ">
            <div className="flex w-4/12 justify-start items-start flex-col  m-4 my-2 ">
              <div className="w-full">
                <Droppable droppableId="droppable1">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {items.length > 0 ? (
                        items.map((ele, index) => {
                          return (
                            <Draggable
                              key={index}
                              draggableId={String(index)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={`cursor-pointer hover:bg-teal-400 hover:text-white dark:text-white hover:rounded-lg w-full ${
                                    currentData.indexCount == index
                                      ? "bg-teal-400 text-white rounded-lg"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setcurrentType(ele.type);
                                    if (ele.type == "schedule") {
                                      handleAddChapterContent(ele.type);
                                    }
                                    const obj = {
                                      type: ele.type
                                    };

                                    if (ele.type == "assessment") {
                                      obj.id = ele.id;
                                    }
                                    if (ele.type == "flashcard") {
                                      obj.id = ele.flash_id;
                                    }
                                    if (ele.type == "schedule") {
                                      obj.id = ele.schedule_id;
                                    }
                                    if (ele.type == "reading_material") {
                                      obj.id = ele.read_id;
                                    }
                                    if (ele.type == "quiz") {
                                      obj.id = ele.id;
                                    }

                                    obj.indexCount = index;

                                    //   console.log(obj);
                                    setcurrentData(obj);
                                  }}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  // {...provided.dragHandleProps}
                                >
                                  <ContextMenu className="">
                                    <ContextMenuTrigger>
                                      <div className="flex justify-end items-center border-2 border-solid border-teal-700 my-3 rounded h-full">
                                        <div className="w-10/12">
                                          <ContentList item={ele} />
                                        </div>
                                        <div
                                          className="w-2/12 flex justify-center items-center h-full"
                                          {...provided.dragHandleProps}
                                        >
                                          <RiDragMove2Fill />
                                        </div>
                                      </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                      <ContextMenuItem
                                        onClick={() => {
                                          const obj = {
                                            type: ele.type
                                          };

                                          if (ele.type == "assessment") {
                                            obj.id = ele.id;
                                            obj.title = ele.title;
                                            obj.description = ele.description;
                                          }
                                          if (ele.type == "flashcard") {
                                            obj.id = ele.flash_id;
                                            obj.title = ele.flashcard_name;
                                            obj.description =
                                              ele.flashcard_description;
                                          }
                                          if (ele.type == "schedule") {
                                            obj.id = ele.schedule_id;
                                            obj.title = ele.title;
                                            obj.description = ele.description;
                                          }
                                          if (ele.type == "reading_material") {
                                            obj.id = ele.read_id;
                                            obj.title = ele.title;
                                            obj.description = ele.description;
                                          }
                                          if (ele.type == "quiz") {
                                            obj.id = ele.id;
                                            obj.title = ele.name;
                                            obj.description = ele.description;
                                          }

                                          seteditContentData(obj);

                                          settitle(obj.title);
                                          setdescription(obj.description);
                                          setOpen(!open);
                                        }}
                                      >
                                        Edit
                                      </ContextMenuItem>
                                      <ContextMenuItem
                                        onClick={() => {
                                          const obj = {
                                            type: ele.type
                                          };

                                          if (ele.type == "assessment") {
                                            obj.id = ele.id;
                                          }
                                          if (ele.type == "flashcard") {
                                            obj.id = ele.flash_id;
                                          }
                                          if (ele.type == "schedule") {
                                            obj.id = ele.schedule_live_class_id;
                                          }
                                          if (ele.type == "reading_material") {
                                            obj.id = ele.read_id;
                                          }
                                          if (ele.type == "quiz") {
                                            obj.id = ele.id;
                                          }
                                          setdeleteContentData(obj);
                                          setDeleteContentalert(true);
                                        }}
                                      >
                                        Delete
                                      </ContextMenuItem>
                                    </ContextMenuContent>
                                  </ContextMenu>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <div className="w-full font-bold  min-h-[10rem] flex justify-center items-center text-black dark:text-white">
                          <h2>No Items found</h2>
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            <div className="flex w-8/12 justify-start items-start flex-col m-4  p-4 h-full my-2">
              <div className="border border-teal-500 border-dashed w-full rounded-md ">
                {currentType != "schedule" && (
                  <ContentData currentData={currentData} />
                )}

                {currentType == "schedule" && (
                  <div className="overflow-auto h-[70svh]">
                    <Droppable droppableId="droppable2">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="w-full flex flex-col bg-gray-200 justify-center items-center"
                        >
                          {eventsSchedule.length > 0 ? (
                            eventsSchedule.map((item, index) => (
                              <Draggable
                                key={index + 1000}
                                draggableId={String(index + 1000)}
                                index={index + 1000}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      backgroundColor: "#fff",
                                      borderRadius: 4,
                                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                      ...provided.draggableProps.style
                                    }}
                                    className="w-6/12 flex justify-center  items-center"
                                  >
                                    <div className="flex w-full  my-3 rounded h-full">
                                      <div className="w-full flex justify-start items-start flex-col">
                                        <div>
                                          <div>Live Class</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div className="text-lg min-h-24 flex items-center justify-center">
                              No classes
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* sheet  */}

          <div>
            <Sheet key={side} open={open} onOpenChange={setOpen}>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Update </SheetTitle>
                  <SheetDescription>Title and Description.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {editContentData.type != "schedule" ? (
                    <div className="">
                      {" "}
                      <div className="grid grid-cols-4 items-center gap-4 my-2">
                        <label htmlFor="name" className="text-right">
                          Title
                        </label>
                        <input
                          id="title"
                          placeholder="Title"
                          value={title}
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            settitle(e.target.value);
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
                          value={description}
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          onChange={(e) => {
                            setdescription(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1>Schedule Edit is not authorized</h1>
                    </div>
                  )}
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      onClick={handleEditItem}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Update
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* sheet  */}

          {/* Alert  */}

          <div>
            <AlertDialog
              className="relative"
              open={DeleteContentalert}
              onOpenChange={setDeleteContentalert}
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
                      handleDeleteList();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* Alert  */}
        </DragDropContext>
      </div>
    </>
  );
};

export default LanguageLevelChapterContent;
