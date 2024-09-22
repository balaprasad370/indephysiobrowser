import React from "react";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import moment from "moment";

const ContentList = ({ item }) => {
  //   console.log(item);

  return (
    <>
      {/* <div>{JSON.stringify(item.id)}</div> */}
      <div className="p-2">
        {item?.type == "assessment" && (
          <div className="flex items-start flex-col text-start">
            <div className="font-bold">Assessment</div>
            <div>{item.title}</div>
            <div>{item.description}</div>
          </div>
        )}

        {item?.type == "quiz" && (
          <div className="flex items-start flex-col text-start">
            <div className="font-bold">Quiz</div>
            <div>{item.name}</div>
            <div>{item.description}</div>
          </div>
        )}
        {item?.type == "flashcard" && (
          <div className="flex items-start flex-col text-start">
            <div className="font-bold">Flashcard</div>
            <div>{item.flashcard_name}</div>
            <div>{item.flashcard_description}</div>
          </div>
        )}
        {item?.type == "schedule" && (
          <div className="flex items-start flex-col text-start w-full">
            <div className="flex justify-between items-center w-full">
              <div className="font-bold">Live Class</div>
              <div>
                <FaCalendarAlt />
              </div>
              <div>{item?.status == 1 && <FaCheckCircle color="green" />}</div>
            </div>


            {item?.source == "outside" ? (
              <div>
                {/* <div>{item?.schedule_start_date}</div>
                <div>{item?.schedule_start_time}</div>
                */}
                <div>Live class</div>
              </div>
            ) : (
              <div>
                <div className="font-bold">Live class</div>
                {/* <div className="font-bold">{item?.description_live}</div> */}
              </div>
            )}
          </div>
        )}

        {item?.type == "reading_material" && (
          <div className="flex items-start flex-col text-start">
            <div className="font-bold">Reading Material</div>
            <div>{item.title}</div>
            <div>{item.description}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentList;
