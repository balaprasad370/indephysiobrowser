import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDragMove2Fill } from "react-icons/ri";
import ContentList from "./../admincomponents/ContentList";
import ContentData from "./../admincomponents/ContentData";

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

  const { chapter_id } = useParams();
  const [addtype, setaddtype] = useState("");

  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [editContentData, seteditContentData] = useState({});
  const [open, setOpen] = useState(false);
  const side = "top";

  const [DeleteContentalert, setDeleteContentalert] = useState(false);
  const [deleteContentData, setdeleteContentData] = useState("");

  const [currentData, setcurrentData] = useState({});

  useEffect(() => {
    const getToken = localStorage.getItem("token");
    settoken(getToken);

    getAllChapterContent(getToken);
  }, []);

  const getAllChapterContent = async (getToken) => {
    const res = await axios({
      method: "get",
      url: "https://server.indephysio.com/chapter/v1/admin/" + chapter_id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken
      }
    });
    setitems(res.data);
    console.log(res.data);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    // Handle drag end logic here
    const { destination, source } = result;

    // If there is no destination (dropped outside the list), do nothing
    if (!destination) {
      return;
    }

    // If the item is dropped in the same position, do nothing
    if (destination.index === source.index) {
      return;
    }

    // Reorder the items based on the drag result
    const reorderedItems = reorder(items, source.index, destination.index);

    // Update the state with the new order
    setitems(reorderedItems);

    // console.log(result);

    const data = [];
    reorderedItems.forEach((element, index) => {
      console.log(element.type);

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
    updateOrder(data);
  };

  const updateOrder = async (data) => {
    try {
      const res = await axios({
        method: "post",
        data: {
          items: data
        },
        url: "https://server.indephysio.com/chapter/v1/admin/rearrange",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddChapterContent = async (val) => {
    console.log(val);

    const obj = {
      chapter_id: chapter_id,
      order_id: items.length,
      type: val
    };

    try {
      const res = await axios({
        method: "post",
        data: obj,
        url: "https://server.indephysio.com/chapters/v1/admin/add",
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

    const frWrapper = document.querySelector('.fr-wrapper');

    // Check if the element exists and has at least one child
    if (frWrapper && frWrapper.firstChild) {
      // Remove the first child
      frWrapper.removeChild(frWrapper.firstChild);
    }

    
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
        url: "https://server.indephysio.com/chapters/v1/admin/delete",
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
        url: "https://server.indephysio.com/chapters/v1/admin/update",
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

  return (
    <>
      <div className="w-full">
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
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
                                          className="w-2/12 flex justify-center items-center h-full w-full "
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
                                            obj.id = ele.schedule_id;
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
                        <div className="w-full font-bold  min-h-[10rem] flex justify-center items-center">
                          <h2>No Items found</h2>
                        </div>
                      )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          <div className="flex w-8/12 justify-start items-start flex-col m-4  p-4 h-full my-2">
            <div className="border border-teal-500 border-dashed w-full rounded-md min-h-full">
              <ContentData currentData={currentData} />
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
                <div className="grid grid-cols-4 items-center gap-4">
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
      </div>
    </>
  );
};

export default LanguageLevelChapterContent;
