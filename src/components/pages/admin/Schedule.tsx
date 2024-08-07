import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

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
import { Button } from "../../ui/button";
const side = "right";
const shortMonths = [
  "Jan", // January
  "Feb", // February
  "Mar", // March
  "Apr", // April
  "May", // May
  "Jun", // June
  "Jul", // July
  "Aug", // August
  "Sep", // September
  "Oct", // October
  "Nov", // November
  "Dec" // December
];
const Schedule = () => {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef(null);

  const [selectedDateTime, setselectedDateTime] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");

  const [events, setEvents] = useState([]);

  const handleDateSelect = (event) => {
    setselectedDateTime(event);
    setOpen(true);
    return;
    if (event.view.type == "dayGridMonth") {
      console.log("Dcsdf", event.view.type);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(event.start);
      calendarApi.changeView("resourceTimeGridDay");
      return;
    }
    console.log(event);
    if (
      window.confirm(
        "Would you like to add an event to " + event.startStr + " ?"
      )
    ) {
      setEvents(
        events.concat({
          title: "New Event",
          startRecur: event.startStr,
          endRecur: "2024-08-15",
          // end: event.endStr,
          startTime: "11:00:00",
          endTime: "11:30:00",
          daysOfWeek: ["1"],
          resourceId: event.resource._resource.id
        })
      );
    }
  };

  const handleEventClick = (e) => {
    alert(JSON.stringify(e));
  };

  const resources = [
    { id: 1, title: "Indephysio", color: "red" },
  ];

  return (
    <div className="text-black dark:text-white px-4 w-full flex">
      <div className="w-full dark:bg-gray-800">
        <FullCalendar
          ref={calendarRef}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            scrollGridPlugin,
            resourceTimeGridPlugin
            // resourceTimelinePlugin
          ]}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth"
          }}
          initialView="resourceTimeGridDay"
          // views={{
          //   resourceTimeGridDay: {
          //     type: "resourceTimeGrid",
          //     duration: { days: 1 }
          //   }
          // }}
          datesAboveResources={true}
          // datesAboveResources={true}
          allDaySlot={false}
          dayMinWidth={200}
          slotMinTime={"05:00:00"}
          slotMaxTime={"23:00:00"}
          slotDuration="00:05:00"
          eventResize={(info) => console.log(info)}
          eventChange={(info) => console.log(info)}
          editable={true}
          selectable={true}
          scrollTime={0}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          resources={resources}
        />
      </div>

      {/* sheet  */}
      <div>
        <div>
          <Sheet key={side} open={open} onOpenChange={setOpen}>
            <SheetContent
              side={side}
              className="!max-w-[39rem] sm:w-[40rem] overflow-auto"
            >
              <SheetHeader>
                <SheetTitle> Create Slot</SheetTitle>
                <SheetDescription>Title and Description.</SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div>Start</div>
                      <div>
                        <div>
                          <h2 className="title">Slot Date & Time</h2>
                        </div>

                        <div>
                          <div>
                            {selectedDateTime != "" && (
                              <div>
                                <span className="text-teal-600 font-bold">
                                  {selectedDateTime.start
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}{" "}
                                  {
                                    shortMonths[
                                      selectedDateTime.start.getMonth()
                                    ]
                                  }
                                  , {selectedDateTime.start.getFullYear()} ||{" "}
                                  {selectedDateTime.start
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}
                                  :
                                  {selectedDateTime.start
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div>End</div>
                      <div>
                        <div>
                          <h2 className="title">Slot Date & Time</h2>
                        </div>

                        <div>
                          <div>
                            {selectedDateTime != "" && (
                              <div>
                                <span className="text-teal-600 font-bold">
                                  {selectedDateTime.end
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}{" "}
                                  {shortMonths[selectedDateTime.end.getMonth()]}
                                  , {selectedDateTime.end.getFullYear()} ||{" "}
                                  {selectedDateTime.end
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}
                                  :
                                  {selectedDateTime.end
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <pre>{JSON.stringify(selectedDateTime, null, 2)}</pre> */}
              </div>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start">
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
                <div className="flex flex-col items-start">
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
                    // onClick={handleEditItem}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Create Slot
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* sheet  */}
    </div>
  );
};

export default Schedule;
