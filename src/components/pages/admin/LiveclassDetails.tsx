import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalInfo } from "./../../../App";

const LiveclassDetails = () => {
  const context = useContext(GlobalInfo);
  const { room_name, date, schedule_id } = useParams();
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [liveclassDetails, setLiveclassDetails] = useState([]);
  const [addItToLiveClass, setaddItToLiveClass] = useState(false);

  const [currentTab, setCurrentTab] = useState(null);
  const [schedule_live_class_id, setschedule_live_class_id] = useState(0);

  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const navigate = useNavigate();

  const getLiveclassDetails = async () => {
    try {
      const res = await axios({
        method: "get",
        url: context.apiEndPoint + `liveclass/${room_name}/${date}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiveclassDetails(res.data);
      if (res.data.length > 0) {
        setSelectedRecordings([res.data[0].recording_path]);
      } else {
        setSelectedRecordings([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLiveclassDetails();
    getScheduleLiveClassId();
  }, []);

  const getScheduleLiveClassId = async () => {
    try {
      const res = await axios({
        method: "get",
        url: context.apiEndPoint + `liveclass/schedule/${room_name}/${date}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.length > 0 && res.data[0].schedule_live_class_id) {
        setschedule_live_class_id(res.data[0].schedule_live_class_id);
      } else {
        setschedule_live_class_id(0);
      }
      // console.log("dcvads", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabClick = (item) => {
    setCurrentTab(item);
  };

  const handleComplete = async () => {
    if (confirm("Are you sure you want to complete the live class?")) {
      try {
        const obj = {
          live_class_status: addItToLiveClass,
          room_name: room_name,
          created_at: date,
          recording_url: selectedRecordings.join(","),
          schedule_id: schedule_id,
          schedule_live_class_id: schedule_live_class_id
            ? schedule_live_class_id
            : 0
        };

        const res = await axios({
          method: "post",
          url: context.apiEndPoint + `liveclass/complete`,
          data: obj,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(res.data);

        navigate("/admin/schedule");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRecordingSelection = (recording_path) => {
    // console.log("====================================");
    // console.log(selectedRecordings);
    // console.log("====================================");

    if (selectedRecordings.includes(recording_path)) {
      const _recordings = selectedRecordings.filter(
        (path) => path !== recording_path
      );
      setSelectedRecordings(_recordings);
    } else {
      const _recordings = [...selectedRecordings, recording_path];
      setSelectedRecordings(_recordings);
    }
  };

  return (
    <div className="w-full h-full my-4 py-4 px-4">
      <div className="flex flex-row justify-between w-full">
        <h1 className="text-2xl font-bold">Live class details</h1>
        <div className="flex flex-row">
          <div className="flex items-center mr-4">
            <input
              type="checkbox"
              id="downloadCheckbox"
              className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
              checked={addItToLiveClass}
              onChange={() => setaddItToLiveClass(!addItToLiveClass)}
            />
            <label
              htmlFor="downloadCheckbox"
              className="ml-2 text-sm cursor-pointer"
            >
              Add to live class
            </label>
          </div>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600 transition duration-300"
            onClick={handleComplete}
          >
            Complete
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left column with tabs */}
        <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-4">
          <div className="flex flex-col">
            {liveclassDetails.length > 0 ? (
              liveclassDetails.map((item, index) => (
                <div className="flex flex-row w-full justify-between items-center">
                  <input
                    type="checkbox"
                    id={`recording-${index}`}
                    className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer mr-2"
                    checked={selectedRecordings.includes(item.recording_path)}
                    onChange={() =>
                      handleRecordingSelection(item.recording_path)
                    }
                  />
                  <button
                    onClick={() => handleTabClick(item)}
                    className="bg-blue-500 text-white py-2 px-4 rounded mb-2 hover:bg-blue-600 transition duration-300 flex-1"
                  >
                    Recording {index + 1}
                  </button>
                </div>
              ))
            ) : (
              <p>No recordings found</p>
            )}
          </div>
        </div>

        {/* Right column for content */}
        <div className="w-full md:w-2/3">
          <div className="bg-white p-4 rounded shadow">
            {/* Content for the selected tab will go here */}

            {currentTab && (
              <div>
                <video
                  key={currentTab.recording_path}
                  controls
                  controlsList="nodownload"
                >
                  <source
                    src={context.liveclassServerUrl + currentTab.recording_path}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveclassDetails;
