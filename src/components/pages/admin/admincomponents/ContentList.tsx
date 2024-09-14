import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
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
            </div>
            {item?.source == "outside" ? (
              <div>
                {/* <div>{item?.schedule_start_date}</div>
                <div>{item?.schedule_start_time}</div>
                <div>{item?.title}</div>
                <div>{item?.description}</div> */}

                <div className="w-full flex justify-between items-center">
                  <div className="flex ">
                    <p>
                      {moment(item?.schedule_start_date).format("DD MMM, YYYY")}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="font-bold">
                      {moment(
                        item?.schedule_start_date +
                          " " +
                          item?.schedule_start_time
                      ).format("h:mm a")}
                    </p>
                    -
                    <p className="font-bold">
                      {moment(
                        item?.schedule_start_date +
                          " " +
                          item?.schedule_end_time
                      ).format("h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold">{item?.title_live}</div>

                <div className="w-full flex flex-col justify-between items-start">
                  <div className="flex justify-start items-center text-start">
                    <p>
                      {" "}
                      <span>Date: </span>
                      <span className="font-bold">
                        {moment(item?.schedule_start_date_live).format(
                          "DD MMM, YYYY"
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-start items-center">
                    Timings: &nbsp;
                    <p className="font-bold">
                      {moment(
                        item?.schedule_start_date_live +
                          " " +
                          item?.schedule_start_time_live
                      ).format("h:mm a")}
                    </p>
                    -
                    <p className="font-bold">
                      {moment(
                        item?.schedule_end_date_live +
                          " " +
                          item?.schedule_end_time_live
                      ).format("h:mm a")}
                    </p>
                  </div>
                </div>
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
