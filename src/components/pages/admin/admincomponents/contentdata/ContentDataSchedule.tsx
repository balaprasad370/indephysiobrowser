import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // a plugin!
import axios from "axios";

const ContentDataSchedule = ({ id }) => {
  const [events, setevents] = useState([]);
  const [token, settoken] = useState(localStorage.getItem("token"));

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    getAllEvents();
  }, [id]);

  const getAllEvents = async () => {
    console.log(id);

    try {
      const res = await axios({
        method: "get",
        url: "https://server.indephysio.com/schedule/" + id,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      const _events = [];
      res.data.forEach((element) => {
        _events.push({
          title: element.title,
          date: element.start
        });
      });

      console.log("events", _events);
      setevents(_events);

      //   setevents(res.data);
      //   console.log(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateSelect = (event) => {
    console.log("====================================");
    console.log(event);
    console.log("====================================");
  };

  //   const gotoDate = () => {
  //     const calendarApi = calendarRef.current.getApi();
  //     calendarApi.gotoDate(date.toISOString().split("T")[0]);
  //   };

  const handleEventClick = (e) => {
    alert(JSON.stringify(e));
  };

  const handleDateClick = (arg) => {
    if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
      setevents(
        events.concat({
          // creates a new array
          title: "New Event",
          start: arg.date,
          allDay: arg.allDay
        })
      );
    }
  };

  return (
    <>
      <div className="text-black dark:text-white px-4 w-full flex">
        <div className="w-full dark:bg-gray-800">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            initialView="timeGridDay"
            editable={true}
            selectable={true}
            selectMirror={true}
            scrollTime={0}
            slotDuration="00:30:00"
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            //   eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            //   eventsSet={handleEvents}
          />
        </div>
      </div>
    </>
  );
};

export default ContentDataSchedule;
