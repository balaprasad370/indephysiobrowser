// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { cn } from "./../../../utils/cn";
// import { HoverEffect } from "./../../ui/card-hover-effect";
// import { Button } from "./../../ui/button";
// import Auth from "./../../../hooks/useAuth";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetFooter,
//   SheetClose
// } from "../../ui/sheet.tsx";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger
// } from "../../ui/alert.tsx";
// import { Button } from "../../ui/button";
// import { HoverEffect } from "./../../ui/card-no-link";

// const Chapters = () => {
//   const [quizzes, setquizzes] = useState([]);
//   const [moduleName, setmoduleName] = useState("");
//   const [moduleDescription, setmoduleDescription] = useState("");
//   const [moduleEditName, setmoduleEditName] = useState("");
//   const [moduleEditDescription, setmoduleEditDescription] = useState("");
//   const [moduleEditId, setmoduleEditId] = useState("");
//   const [open, setOpen] = useState(false);

//   const [openDelete, setOpenDelete] = useState(false);

//   const [chapterId, setchapterId] = useState("");

//   const tokenData = Auth();
//   console.log("====================================");
//   console.log(tokenData);
//   console.log("====================================");

//   useEffect(() => {
//     fetchQuizzes();
//   }, []);

//   const fetchQuizzes = async () => {
//     try {
//       const response = await axios({
//         method: "get",
//         url: "https://server.indephysio.com/chapters/all/all/"
//       });
//       setquizzes(response.data);
//     } catch (error) {}
//   };

//   const handleDeleteModule = async (id) => {
//     setOpenDelete(true);
//     setchapterId(id);
//   };
//   const handleDeleteConfirm = async () => {
//     setOpenDelete(false);
//     try {
//       const res = await axios({
//         method: "post",
//         url: "https://server.indephysio.com/chapters/all/delete",
//         data: {
//           chapter_id: chapterId
//         }
//       });
//     } catch (error) {
//       console.log("====================================");
//       console.log(error);
//       console.log("====================================");
//     }

//     fetchQuizzes();

//     // console.log(res.data);
//   };

//   const handleEditModule = async (id) => {
//     // console.log(id);

//     let response = await axios({
//       method: "get",
//       url: "https://server.indephysio.com/chapters/all/" + id
//     });

//     console.log(response.data);
//     setmoduleEditId(response.data.id);
//     setmoduleEditName(response.data.name);
//     setmoduleEditDescription(response.data.description);

//     setOpen(true);
//   };

//   const handleModule = async () => {
//     // console.log(moduleName, moduleDescription);

//     const obj = {
//       chapter_name: moduleName,
//       chapter_description: moduleDescription,
//       client_id: tokenData.client_id
//     };

//     const res = await axios({
//       method: "post",
//       url: "https://server.indephysio.com/chapters/all/add",
//       data: obj
//     });

//     fetchQuizzes();

//     setmoduleName("");
//     setmoduleDescription("");
//     console.log(res.data);
//   };

//   const handleEditModuleUpdate = async () => {
//     console.log(moduleEditId, moduleEditName, moduleEditDescription);
//     const obj = {
//       chapter_id: moduleEditId,
//       chapter_name: moduleEditName,
//       chapter_description: moduleEditDescription
//     };

//     const res = await axios({
//       method: "post",
//       url: "https://server.indephysio.com/chapters/all/update",
//       data: obj
//     });

//     fetchQuizzes();
//   };

//   const side = "bottom";
//   return (
//     <div className="my-4 w-full">
//       {/* alert */}

//       {/* alert  */}

//       <AlertDialog
//         className="relative"
//         open={openDelete}
//         onOpenChange={setOpenDelete}
//       >
//         <AlertDialogTrigger
//           asChild
//           className="absolute right-0 top-0"
//         ></AlertDialogTrigger>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete this
//               module.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => {
//                 handleDeleteConfirm();
//               }}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* alert */}

//       {/* alert */}

//       <div>
//         <Sheet key={side} open={open} onOpenChange={setOpen}>
//           <SheetContent side={side}>
//             <SheetHeader>
//               <SheetTitle>Update Chapter</SheetTitle>
//               <SheetDescription>
//                 Name and describe your module to create a module.
//               </SheetDescription>
//             </SheetHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="name" className="text-right">
//                   Name your Chapter
//                 </label>
//                 <input
//                   id="name"
//                   placeholder="Name your Chapter"
//                   value={moduleEditName}
//                   className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   onChange={(e) => {
//                     setmoduleEditName(e.target.value);
//                   }}
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="describe" className="text-right">
//                   Description
//                 </label>
//                 <input
//                   id="describe"
//                   placeholder="Describe the Chapter"
//                   value={moduleEditDescription}
//                   className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                   onChange={(e) => {
//                     setmoduleEditDescription(e.target.value);
//                   }}
//                 />
//               </div>
//             </div>
//             <SheetFooter>
//               <SheetClose asChild>
//                 <Button
//                   onClick={handleEditModuleUpdate}
//                   className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
//                 >
//                   Update Chapter
//                 </Button>
//               </SheetClose>
//             </SheetFooter>
//           </SheetContent>
//         </Sheet>
//       </div>

//       <div className="w-full py-4 my-4 flex items-start px-3 justify-center">
//         <div className="w-4/5 py-4 my-4 flex items-center px-3 justify-between">
//           <div>
//             <h1 className="text-black dark:text-white">Chapters</h1>
//           </div>

//           <div>
//             <Sheet key={side}>
//               <SheetTrigger asChild>
//                 <Button variant="outline">Create Chapter</Button>
//               </SheetTrigger>
//               <SheetContent side={side}>
//                 <SheetHeader>
//                   <SheetTitle>Create Chapter</SheetTitle>
//                   <SheetDescription>
//                     Name and describe your module to create a module.
//                   </SheetDescription>
//                 </SheetHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="name" className="text-right">
//                       Name your Chapter
//                     </label>
//                     <input
//                       id="name"
//                       placeholder="Name your Chapter"
//                       value={moduleName}
//                       className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                       onChange={(e) => {
//                         setmoduleName(e.target.value);
//                       }}
//                     />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="describe" className="text-right">
//                       Description
//                     </label>
//                     <input
//                       id="describe"
//                       placeholder="Describe the Chapter"
//                       value={moduleDescription}
//                       className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                       onChange={(e) => {
//                         setmoduleDescription(e.target.value);
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <SheetFooter>
//                   <SheetClose asChild>
//                     <Button
//                       onClick={handleModule}
//                       className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
//                     >
//                       Create Chapter
//                     </Button>
//                   </SheetClose>
//                 </SheetFooter>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//       <div className="w-full flex items-center justify-center">
//         <div className="w-4/5">
//           <HoverEffect
//             items={quizzes}
//             handleDeleteModule={handleDeleteModule}
//             handleEditModule={handleEditModule}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chapters;

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialItems = [
  { id: "item-1", content: "Item 1" },
  { id: "item-2", content: "Item 2" },
  { id: "item-3", content: "Item 3" }
];

const initialItems2 = [
  { id: "item-4", content: "Item 4" },
  { id: "item-5", content: "Item 5" },
  { id: "item-6", content: "Item 6" }
];

const VerticalLists = () => {
  const [list1, setList1] = useState(initialItems);
  const [list2, setList2] = useState(initialItems2);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    // Restrict items in the left list from being dragged to the right list
    if (
      source.droppableId === "droppable1" &&
      destination.droppableId === "droppable2"
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const items = reorder(
        source.droppableId === "droppable1" ? list1 : list2,
        source.index,
        destination.index
      );

      if (source.droppableId === "droppable1") {
        setList1(items);
      } else {
        setList2(items);
      }
    } else {
      // Moving between lists
      const result = move(
        source.droppableId === "droppable1" ? list1 : list2,
        source.droppableId === "droppable1" ? list2 : list1,
        source,
        destination
      );

      setList1(result.droppable1);
      setList2(result.droppable2);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Droppable droppableId="droppable1">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 8,
                width: 250,
                minHeight: 500,
                backgroundColor: "#f0f0f0"
              }}
            >
              {list1.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="droppable2">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: 8,
                width: 250,
                minHeight: 500,
                backgroundColor: "#f0f0f0"
              }}
            >
              {list2.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

// Helper functions for reordering and moving items
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  console.log("====================================");
  console.log(removed, destClone);
  console.log("====================================");

  return {
    droppable1:
      droppableSource.droppableId === "droppable1" ? sourceClone : destClone,
    droppable2:
      droppableSource.droppableId === "droppable1" ? destClone : sourceClone
  };
};

export default VerticalLists;
