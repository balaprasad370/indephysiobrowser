import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import scrollGridPlugin from "@fullcalendar/scrollgrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { RadioGroup, RadioGroupItem } from "../../ui/radio";
import rrulePlugin from "@fullcalendar/rrule";
import { RRule } from "rrule";
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
} from "../../ui/sheet.tsx";
import { Button } from "../../ui/button";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "./../../../utils/cn";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../ui/select.tsx";

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
const shortWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const Schedule = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const calendarRef = useRef(null);

  const [selectedDateTime, setselectedDateTime] = useState("");
  const [selectedDateTimeEdit, setselectedDateTimeEdit] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [recurEventType, setrecurEventType] = useState("");

  const [editData, seteditData] = useState("");

  const [fromdate, setfromDate] = useState("");
  const [todate, settoDate] = useState("");
  const [token, settoken] = useState(localStorage.getItem("token"));

  const [events, setEvents] = useState([]);
  const [levels, setlevels] = useState([]);
  const [packages, setpackages] = useState([]);
  const [levelId, setlevelId] = useState("");
  const [packageId, setpackageId] = useState("");

  useEffect(() => {
    getScheduleEvents();
    handleGetLevels();
  }, []);

  const getScheduleEvents = async () => {
    try {
      const res = await axios({
        method: "get",
        url: "https://server.indephysio.com/schedule/v1/get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      const _events = [];
      res.data.forEach((ele, index) => {
        let eve = {};
        if (ele.schdeule_recur_type == "") {
          eve = {
            title: ele.title,
            start: new Date(
              moment(
                ele.schedule_start_date + " " + ele.schedule_start_time,
                "YYYY-MM-DD HH:mm:ss"
              )
            ),
            end: new Date(
              moment(
                ele.schedule_end_date + " " + ele.schedule_end_time,
                "YYYY-MM-DD HH:mm:ss"
              )
            ),
            resourceId: 1,
            allDay: false,
            backgroundColor:
              ele?.package_color != null ? ele.package_color : "",
            id: "event" + ele.schedule_id
          };
        } else if (ele.schdeule_recur_type == "daily") {
          eve = {
            title: ele.title,
            groupId: "redevents" + index,
            allDay: false,
            startTime: ele.schedule_start_time,
            resourceId: 1,
            backgroundColor:
              ele?.package_color != null ? ele.package_color : "",
            endTime: ele.schedule_end_time,
            id: "event" + ele.schedule_id,
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
          };

          eve.startRecur = moment(ele.schedule_recurring_date_start).format(
            "YYYY-MM-DD"
          );
          // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

          if (ele.schedule_recurring_date_start != "") {
            eve.startRecur = moment(ele.schedule_recurring_date_start).format(
              "YYYY-MM-DD"
            );
          }

          if (ele.schedule_recurring_date_end != "") {
            eve.endRecur = moment(ele.schedule_recurring_date_end)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }
        } else if (ele.schdeule_recur_type == "weekly") {
          eve = {
            title: ele.title,
            groupId: "redevents",
            allDay: false,
            startTime: ele.schedule_start_time,
            resourceId: 1,
            backgroundColor:
              ele?.package_color != null ? ele.package_color : "",
            endTime: ele.schedule_end_time,
            daysOfWeek: [ele.schedule_recur_week_index],
            id: "event" + ele.schedule_id
          };

          eve.startRecur = moment(ele.schedule_recurring_date_start).format(
            "YYYY-MM-DD"
          );
          // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

          if (ele.schedule_recurring_date_start != "") {
            eve.startRecur = moment(ele.schedule_recurring_date_start).format(
              "YYYY-MM-DD"
            );
          }
          if (ele.schedule_recurring_date_end != "") {
            eve.endRecur = moment(ele.schedule_recurring_date_end)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }
        } else if (ele.schdeule_recur_type == "weekdays") {
          eve = {
            title: ele.title,
            groupId: "redevents",
            allDay: false,
            startTime: ele.schedule_start_time,
            endTime: ele.schedule_end_time,
            resourceId: 1,
            backgroundColor:
              ele?.package_color != null ? ele.package_color : "",
            daysOfWeek: [1, 2, 3, 4, 5],
            id: "event" + ele.schedule_id
          };

          eve.startRecur = moment(ele.schedule_recurring_date_start).format(
            "YYYY-MM-DD"
          );
          // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

          if (ele.schedule_recurring_date_start != "") {
            eve.startRecur = moment(ele.schedule_recurring_date_start).format(
              "YYYY-MM-DD"
            );
          }
          if (ele.schedule_recurring_date_end != "") {
            eve.endRecur = moment(ele.schedule_recurring_date_end)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }
        }
        _events.push(eve);
      });
      setEvents(_events);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetLevels = async (getToken) => {
    const res = await axios({
      method: "get",
      url: "https://server.indephysio.com/levels/de",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });

    setlevels(res.data);
    console.log(res.data);
  };

  const handleGetPackages = async (level_id) => {
    const res = await axios({
      method: "get",
      url: "https://server.indephysio.com/packages/de/" + level_id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    console.log(res.data);
    setpackages(res.data);
  };

  const handleDateSelect = (event) => {
    console.log(event);

    if (event.view.type == "dayGridMonth") {
      console.log("Dcsdf", event.view.type);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(event.start);
      calendarApi.changeView("resourceTimeGridDay");
      return;
    }

    setselectedDateTime(event);
    setOpen(true);
    return;
  };

  const handleEventClick = (e) => {
    console.log(e);

    seteditData(e.event.title);
    setselectedDateTimeEdit(e.event);
    setOpenEdit(true);
  };

  const handleCreateSlot = async () => {
    const obj = {
      start: selectedDateTime.start,
      end: selectedDateTime.end,
      title: title,
      description: description,
      packageId: packageId,
      levelId: levelId,
      recurStart: fromdate,
      recurEnd: todate,
      recurEventType: recurEventType,
      event_index: []
    };

    let bgColor = "";
    packages.forEach((ele) => {
      if (ele.package_id === packageId) {
        bgColor = ele.package_color;
      }
    });

    if (recurEventType == "") {
      setEvents(
        events.concat({
          title: title,
          start: selectedDateTime.startStr,
          end: selectedDateTime.endStr,
          resourceId: 1,
          backgroundColor: bgColor,
          allDay: false
        })
      );
    } else if (recurEventType == "daily") {
      const eve = {
        title: title,
        groupId: "redevents",
        allDay: false,
        startTime: moment(selectedDateTime.start).format("HH:mm:ss"),
        resourceId: 1,
        backgroundColor: bgColor,
        endTime: moment(selectedDateTime.end).format("HH:mm:ss"),
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
      };

      obj.event_index = [0, 1, 2, 3, 4, 5, 6];

      eve.startRecur = moment(selectedDateTime.start).format("YYYY-MM-DD");
      // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

      if (fromdate != "") {
        eve.startRecur = moment(fromdate).format("YYYY-MM-DD");
      }
      if (todate != "") {
        eve.endRecur = moment(todate).add(1, "days").format("YYYY-MM-DD");
      }

      setEvents(events.concat(eve));
    } else if (recurEventType == "weekly") {
      const eve = {
        title: title,
        groupId: "redevents",
        allDay: false,
        startTime: moment(selectedDateTime.start).format("HH:mm:ss"),
        resourceId: 1,
        backgroundColor: bgColor,
        endTime: moment(selectedDateTime.end).format("HH:mm:ss"),
        daysOfWeek: [selectedDateTime.start.getDay()]
      };
      obj.event_index = [selectedDateTime.start.getDay()];

      eve.startRecur = moment(selectedDateTime.start).format("YYYY-MM-DD");
      // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

      if (fromdate != "") {
        eve.startRecur = moment(fromdate).format("YYYY-MM-DD");
      }
      if (todate != "") {
        eve.endRecur = moment(todate).add(1, "days").format("YYYY-MM-DD");
      }

      setEvents(events.concat(eve));
    } else if (recurEventType == "weekdays") {
      const eve = {
        title: title,
        groupId: "redevents",
        allDay: false,
        startTime: moment(selectedDateTime.start).format("HH:mm:ss"),
        endTime: moment(selectedDateTime.end).format("HH:mm:ss"),
        resourceId: 1,
        backgroundColor: bgColor,
        daysOfWeek: [1, 2, 3, 4, 5]
      };
      obj.event_index = [1, 2, 3, 4, 5];

      eve.startRecur = moment(selectedDateTime.start).format("YYYY-MM-DD");
      // eve.endRecur = moment(selectedDateTime.end).format("YYYY-MM-DD");

      if (fromdate != "") {
        eve.startRecur = moment(fromdate).format("YYYY-MM-DD");
      }
      if (todate != "") {
        eve.endRecur = moment(todate).add(1, "days").format("YYYY-MM-DD");
      }

      setEvents(events.concat(eve));
    }
    //  else if (recurEventType == "monthly") {
    //   setEvents(
    //     events.concat({
    //       title: "Monthly Event on 21st",
    //       // startTime: moment(selectedDateTime.start).format("HH:mm:ss"),
    //       // endTime: moment(selectedDateTime.end).format("HH:mm:ss"),
    //       allDay: false,
    //       end: moment(selectedDateTime.end).format("HH:mm:ss"),
    //       resourceId: 1,
    //       rrule: {
    //         freq: RRule.MONTHLY,
    //         byminute: [10],
    //         bymonthday: [21], // Day of the month
    //         interval: 1, // Every month
    //         dtstart: moment(selectedDateTime.start).format(
    //           "YYYY-MM-DD HH:mm:ss"
    //         ) // Start time
    //         // until: moment(selectedDateTime.end).format("HH:mm:ss")
    //         // No end date provided, so it recurs indefinitely
    //       }
    //     })
    //   );
    // }

    try {
      const res = await axios({
        method: "post",
        url: "https://server.indephysio.com/schedule/v1/add",
        data: obj,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);

      setselectedDateTime("");
      setrecurEventType("");
      settitle("");
      setdescription("");
      setfromDate("");
      settoDate("");
    } catch (error) {
      console.log(error);
    }

    // setEvents(
    //   events.concat({
    //     title: title,
    //     // startRecur: "2024-08-09",
    //     // endRecur: "2024-08-30",
    //     // end: event.endStr,
    //     start: selectedDateTime.startStr,
    //     resourceId: 1,
    //     end: selectedDateTime.endStr,
    //     allDay: false,
    //     // daysOfWeek: [5],
    //     rrule: {
    //       freq: RRule.MONTHLY,
    //       bymonthday: [9], // Recurs on the 21st day of every month
    //       dtstart: new Date(), // Start date
    //       until: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    //     }
    //   })
    // );
  };

  const handleDeleteSlot = async () => {
    // console.log(selectedDateTimeEdit.id);
    // return;
    try {
      const res = await axios({
        method: "post",
        data: { eventId: selectedDateTimeEdit.id },
        url: "https://server.indephysio.com/schedule/v1/delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      DeleteEventUI(selectedDateTimeEdit.id);
    } catch (error) {}

    setselectedDateTimeEdit("");
  };
  const handleUpdateSlot = async () => {
    const obj = {
      title: editData,
      eventId: selectedDateTimeEdit.id
    };
    const res = await axios({
      method: "post",
      data: obj,
      url: "https://server.indephysio.com/schedule/v1/update",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
    updateEventTitle(selectedDateTimeEdit.id, editData);
    console.log(res.data);
    setselectedDateTimeEdit("");
  };

  const handleChangeEvent = async (event) => {
    const obj = {
      eventId: event.event.id,
      start: event.event.start,
      end: event.event.end
    };

    if (confirm("Do you want to reschedule the event")) {
      const res = await axios({
        method: "post",
        data: obj,
        url: "https://server.indephysio.com/schedule/v1/updatechange",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      console.log(res.data);
    } else {
      console.log(event);
      event.revert();
    }
  };

  const updateEventTitle = (eventId, newTitle) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, title: newTitle } : event
      )
    );
  };
  const DeleteEventUI = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  const resources = [{ id: 1, title: "Indephysio", color: "red" }];

  return (
    <div className="text-black dark:text-white px-4 w-full flex ">
      <div className="w-full dark:bg-gray-800">
        <FullCalendar
          ref={calendarRef}
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            scrollGridPlugin,
            resourceTimeGridPlugin,
            rrulePlugin
            // resourceTimelinePlugin
          ]}
          headerToolbar={{
            left: "prev,next,today",
            center: "title",
            right: "resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth"
          }}
          initialView="resourceTimeGridWeek"
          datesAboveResources={true}
          // datesAboveResources={true}
          allDaySlot={false}
          // dayMinWidth={200}
          slotMinTime={"05:00:00"}
          slotMaxTime={"23:00:00"}
          slotDuration="00:05:00"
          eventChange={handleChangeEvent}
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

              <div className="my-2">
                <label htmlFor="">Choose Level</label>
                <Select
                  className="text-black bg-white w-full flex border-input  border "
                  value={levelId}
                  onValueChange={(value) => {
                    setlevelId(value);
                    handleGetPackages(value);
                  }}
                >
                  <SelectTrigger className="w-full text-black bg-white border-slate-400 border border-solid">
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    {levels.length > 0 ? (
                      levels.map((ele, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={ele.level_id}
                            className="hover:bg-slate-200"
                          >
                            {ele.level_name}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem
                        value={"no"}
                        disabled
                        className="hover:bg-slate-200"
                      >
                        No levels
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="my-2">
                <label htmlFor="">Choose Packages</label>
                <Select
                  className="text-black bg-white w-full flex border-input  border"
                  style={{
                    borderWidth: "1px",
                    borderColor: "#e5e7eb"
                  }}
                  value={packageId}
                  onValueChange={(value) => {
                    setpackageId(value);
                  }}
                >
                  <SelectTrigger className="w-full text-black bg-white border-slate-400 border border-solid">
                    <SelectValue placeholder="Choose level" />
                  </SelectTrigger>
                  <SelectContent className="text-black bg-white">
                    {packages.length > 0 ? (
                      packages.map((ele, index) => {
                        return (
                          <SelectItem
                            key={index}
                            value={ele.package_id}
                            className="hover:bg-slate-200"
                          >
                            {ele.package_name}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem
                        value={"no"}
                        disabled
                        className="hover:bg-slate-200"
                      >
                        No packages
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedDateTime != "" && (
                <div className="py-4">
                  <RadioGroup
                    value={recurEventType}
                    onValueChange={(val) => {
                      setrecurEventType(val);
                    }}
                  >
                    <div>
                      <div className="flex">
                        <div>
                          <RadioGroupItem value="" id="norecur" />
                        </div>
                        <div className="pl-2">
                          <label htmlFor="norecur">
                            {" "}
                            Do not recur this event
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <div>
                          <RadioGroupItem value="daily" id="dailyevent" />
                        </div>
                        <div className="pl-2">
                          <label htmlFor="dailyevent">
                            {" "}
                            Recur this event Daily
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <div>
                          <RadioGroupItem value="weekly" id="weeklyevent" />
                        </div>
                        <div className="pl-2">
                          <label htmlFor="weeklyevent">
                            {" "}
                            Recur this event on{" "}
                            <span className="font-bold">
                              {shortWeek[selectedDateTime.start.getDay()]}
                            </span>{" "}
                            for every week
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex">
                        <div>
                          <RadioGroupItem value="weekdays" id="weekdaysevent" />
                        </div>
                        <div className="pl-2">
                          <label htmlFor="weekdaysevent">
                            {" "}
                            Recur this event only on weekdays
                          </label>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="py-1">
                <div className="flex flex-col">
                  <div className="">
                    <h2 className="font-bold"> Choose Date</h2>
                  </div>
                  <div className="flex justify-between ">
                    <div className="flex flex-col">
                      <div>
                        <h2 className="font-heading  scroll-m-20 text-lg font-semibold tracking-tight">
                          From Date
                        </h2>
                      </div>
                      <div>
                        <Popover className="quiz-details">
                          <PopoverTrigger asChild>
                            <Button
                              disabled={recurEventType == "" ? true : false}
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal border border-solid border-teal-600",
                                !fromdate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fromdate ? (
                                format(fromdate, "PPP")
                              ) : (
                                <span>Pick start date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={fromdate}
                              onSelect={setfromDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div>
                        <h2 className="font-heading  scroll-m-20 text-lg font-semibold tracking-tight">
                          To Date
                        </h2>
                      </div>
                      <div>
                        <Popover className="quiz-details">
                          <PopoverTrigger asChild>
                            <Button
                              disabled={recurEventType == "" ? true : false}
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal border border-solid border-teal-600",
                                !todate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {todate ? (
                                format(todate, "PPP")
                              ) : (
                                <span>Pick end date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={todate}
                              onSelect={settoDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="my-4">
                    <span className="font-bold">Note: </span>
                    <span className="pl-2">
                      If you do not choose from and to date for Recurring events
                      then it will loop infinitely
                    </span>
                  </div>
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    onClick={handleCreateSlot}
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

      {/* edit sheet  */}

      {/* sheet  */}
      <div>
        <div>
          <Sheet key={side} open={openEdit} onOpenChange={setOpenEdit}>
            <SheetContent
              side={side}
              className="!max-w-[39rem] sm:w-[40rem] overflow-auto"
            >
              <SheetHeader>
                <SheetTitle> Edit Slot</SheetTitle>
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
                            {selectedDateTimeEdit != "" && (
                              <div>
                                <span className="text-teal-600 font-bold">
                                  {selectedDateTimeEdit.start
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}{" "}
                                  {
                                    shortMonths[
                                      selectedDateTimeEdit.start.getMonth()
                                    ]
                                  }
                                  , {selectedDateTimeEdit.start.getFullYear()}{" "}
                                  ||{" "}
                                  {selectedDateTimeEdit.start
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}
                                  :
                                  {selectedDateTimeEdit.start
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
                            {selectedDateTimeEdit != "" && (
                              <div>
                                <span className="text-teal-600 font-bold">
                                  {selectedDateTimeEdit.end
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}{" "}
                                  {
                                    shortMonths[
                                      selectedDateTimeEdit.end.getMonth()
                                    ]
                                  }
                                  , {selectedDateTimeEdit.end.getFullYear()} ||{" "}
                                  {selectedDateTimeEdit.end
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0")}
                                  :
                                  {selectedDateTimeEdit.end
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
                    value={editData}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => {
                      seteditData(e.target.value);
                      // const val = e.target.value;
                      // const _editEvent = { ...selectedDateTimeEdit };
                      // _editEvent.title = val;
                      // setselectedDateTimeEdit(_editEvent);
                    }}
                  />
                </div>
                {/* <div className="flex flex-col items-start">
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
                </div> */}
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <div className="flex justify-between w-full">
                    <div>
                      <Button
                        onClick={handleDeleteSlot}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2 bg-red-600"
                      >
                        Delete Slot
                      </Button>
                    </div>
                    <div>
                      <Button
                        onClick={handleUpdateSlot}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#18181b] text-white hover:bg-primary/90 h-10 px-4 py-2"
                      >
                        Update Slot
                      </Button>
                    </div>
                  </div>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* sheet  */}
      {/* edit sheet  */}
    </div>
  );
};

export default Schedule;
