import React, { useState, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdModeEditOutline, MdDeleteOutline } from "react-icons/md";
import { RiDragMove2Fill } from "react-icons/ri";
import { EditText } from "react-edit-text";
import axios from "axios";
import { GlobalInfo } from "./../../../../App";
import { toast } from "sonner";

const DragAndDrop = ({ items, moduleId, questionId, column }) => {
  const [list, setlist] = useState(
    items !== "" && items != undefined ? items : []
  );
  const context = useContext(GlobalInfo);
  // Reordering function when the drag ends
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the destination is null, i.e., dropped outside the list, return
    if (!destination) return;

    const reorderedItems = Array.from(list);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    setlist(reorderedItems);

    const orderData = [];
    for (const ele of reorderedItems) {
      orderData.push(ele.match_id);
    }
    handleUpdateOrder(orderData);
  };

  const handleUpdateOrder = async (orderData) => {
    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "quiz/update/matchOrder",
        data: {
          column: column,
          updateData: orderData,
          moduleId: questionId
        }
      });

      toast.success("Updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateData = async (d) => {
    try {
      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "quiz/update/match",
        data: {
          column: "match_data",
          updateData: d.value,
          match_id: d.name
        }
      });

      // console.log(res.data);

      const _list = [...list];
      for (const ele of _list) {
        if (ele.match_id == d.name) {
          ele.match_data = d.value;
        }
      }

      setlist(_list);

      toast.success("Updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddquestion = async () => {
    try {
      const res = await axios({
        method: "post",
        data: {
          moduleId: moduleId
        },
        url: context.apiEndPoint + "quiz/match/add"
      });

      const orderData = [];
      if (list.length > 0) {
        for (const ele of list) {
          orderData.push(ele.match_id);
        }
        orderData.push(res.data.match_id);
      } else {
        orderData.push(res.data.match_id);
      }

      const data = [...list];
      data.push({
        match_id: res.data.match_id,
        match_data: "match data",
        id: moduleId
      });

      setlist(data);

      // console.log(orderData);

      handleUpdateOrder(orderData);
    } catch (error) {}
  };

  const handleDeleteData = async (match_id) => {
    console.log(match_id);

    const data = list.filter((ele) => ele.match_id != match_id);

    console.log(data);

    setlist(data);

    const result = [];

    for (const ele of data) {
      result.push(ele.match_id);
    }

    console.log(result);
    // return;

    try {
      const res = await axios({
        method: "post",
        data: {
          match_id: match_id,
          questionId: questionId,
          column: column,
          updatedData: result.join(",")
        },
        url: context.apiEndPoint + "quiz/match/delete"
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-end items-center">
        <button
          className="p-1 bg-teal-600  "
          onClick={() => {
            handleAddquestion();
          }}
        >
          Add one
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: "16px",
                width: "300px"
              }}
            >
              {list != undefined &&
                list.length > 0 &&
                list.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={String(1000 + index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        // {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: "16px",
                          margin: "0 0 8px 0",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          ...provided.draggableProps.style
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <EditText
                            name={String(item.match_id)}
                            defaultValue={item.match_data}
                            editButtonProps={{
                              style: {
                                width: 16,
                                padding: 0,
                                backgroundColor: "inherit",
                                color: "inherit"
                              }
                            }}
                            style={{
                              fontSize: "16px",
                              color: "inherit",
                              backgroundColor: "inherit"
                            }}
                            showEditButton
                            editButtonContent={
                              <div className="text-black dark:text-white">
                                {<MdModeEditOutline />}
                              </div>
                            }
                            onSave={(d) => {
                              handleUpdateData(d);
                            }}
                          />

                          <div className="flex items-center ">
                            <div className="pr-4 cursor-pointer">
                              <MdDeleteOutline
                                onClick={() => {
                                  handleDeleteData(item.match_id);
                                }}
                              />
                            </div>

                            <div {...provided.dragHandleProps}>
                              <RiDragMove2Fill />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragAndDrop;
