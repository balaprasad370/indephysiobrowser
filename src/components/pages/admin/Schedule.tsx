import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // a plugin!
import { Calendar } from "../../ui/calendar";

const Schedule = () => {
  const [events, setevents] = useState([]);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    setevents([
      { title: "event 1", date: "2024-06-10" },
      { title: "event 2", date: "2024-06-13" }
    ]);
  }, []);

  const handleDateSelect = (event) => {
    if (confirm("Would you like to add an event to " + event.startStr + " ?")) {
      setevents(
        events.concat({
          // creates a new array
          title: "New Event",
          start: event.startStr,
          end: event.endStr
          // end: "2024-08-04 13:30:00"
        })
      );
    }
  };

  // const gotoDate = () => {
  //   const calendarApi = calendarRef.current.getApi();
  //   calendarApi.gotoDate(date.toISOString().split("T")[0]);
  // };

  const handleEventClick = (e) => {
    alert(JSON.stringify(e));
  };

  const handleDateClick = (arg) => {
    //   if (confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
    //     console.log(arg);
    //     setevents(
    //       events.concat({
    //         // creates a new array
    //         title: "New Event",
    //         start: arg.date
    //         // end: "2024-08-04 13:30:00"
    //       })
    //     );
    //   }
  };

  const handleEventChange = (e) => {
    console.log(e);
  };

  const handleEventResize = (event) => {
    console.log(event.event);
  };

  return (
    <>
      <div className="text-black dark:text-white px-4 w-full flex">
        <div className="mx-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow "
          />
        </div>

        <div className="w-full dark:bg-gray-800">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            timeZone="local"
            allDaySlot={true}
            slotMinTime={"05:00:00"}
            slotMaxTime={"23:00:00"}
            eventResize={handleEventResize}
            eventChange={handleEventChange}
            initialView="timeGridDay"
            initialDate={new Date()}
            editable={true}
            selectable={true}
            selectMirror={true}
            scrollTime={0}
            slotDuration="00:05:00"
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

export default Schedule;
