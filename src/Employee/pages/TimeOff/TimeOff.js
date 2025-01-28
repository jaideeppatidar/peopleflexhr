import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  format,
  startOfYear,
  addMonths,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  startOfMonth,
  getDay,
  isFuture,
  isBefore,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import Header from "../../../Employee/components/Navbar/Navbar";
import TimeOffRequestPopup from "./TimeOffRequestPopup";
import "./TimeOff.css";
import { getTimeOffRequestById } from "../../EmpApiServices";
import { useSelector } from "react-redux";
import CommonHeader from "../../../components/CommonHeader";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

const profileImage = "/assets/images/profile.jpg";

const generateMonthDays = (monthStart) => {
  const monthEnd = endOfMonth(monthStart);
  return eachDayOfInterval({ start: monthStart, end: monthEnd });
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeOff = () => {
  const employeeId = useSelector((state) => state.auth.user.employeeId);
  const [selectedYear, setSelectedYear] = useState(() =>
  new Date().getFullYear()
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    type: "",
    partialDays: "",
  });
  const [leavePeriods, setLeavePeriods] = useState([]);

  const startOfYearDate = useMemo(
    () => startOfYear(new Date(selectedYear, 0, 1)),
    [selectedYear]
  );
  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        addMonths(startOfYearDate, index)
      ),
    [startOfYearDate]
  );
  const today = useMemo(() => new Date(), []);

  const fetchLeavePeriods = async (id) => {
    setLoading(true);

    try {
      const response = await getTimeOffRequestById(id);
            let leaveRequests = response;
      if (response && typeof response === "object") {
        if (Array.isArray(response)) {
          leaveRequests = response;
        } else if (response.data && Array.isArray(response.data)) {
          leaveRequests = response.data;
        } else if (response.leaves && Array.isArray(response.leaves)) {
          leaveRequests = response.leaves;
        } else {
          leaveRequests = response ? [response] : [];
        }
      }
      const approvedLeaves = leaveRequests.filter(
        (leave) => leave?.status === "Approved"
      );
      setLeavePeriods(approvedLeaves);
    } catch (error) {
      console.error("Error fetching leave periods:", error);
      setLeavePeriods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchLeavePeriods(employeeId);
    }
  }, [employeeId]);

 
 

  const isOnLeave = (day) => {
    const normalizedDay = startOfDay(day);

    return leavePeriods.some((period) => {
      const start = startOfDay(new Date(period.startDate));
      const end = startOfDay(new Date(period.endDate));
      const isWithin =
        isWithinInterval(normalizedDay, { start, end }) &&
        period.status === "Approved";
      return isWithin;
    });
  };
  const handleYearChange = useCallback((event) => {
    setSelectedYear(Number(event.target.value));
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLeaveData({ startDate: "", endDate: "", type: "", partialDays: "" });
  };
  const handleDayClick = (day) => {
    if (isToday(day) || isFuture(day)) {
      if (isOnLeave(day)) {
      } else {
        setIsPopupOpen(true);
        setLeaveData({ day });
      }
    } else {
      console.log("Cannot request leave for a past day.");
    }
  };
  const handleRefreshClick =()=>{
    fetchLeavePeriods(employeeId)
  }

  return (
    <>
      <Header
        siteName={"Book Leave Schedule"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["timeoff"]}
      />
      <div className="timeoff-container">
       
        <div className="timeoff-calendar-container">
        <CommonHeader
         showIcons={{ plus: false, trash: true, rotate: true, PdfIcon: false }}
         timeoffRequestCalendar={true}
         handleYearChange={handleYearChange}
         handleRefreshClick={handleRefreshClick}

        />
          
          <div className="maindiv">
          {loading ? (
          <LinearIndeterminate />
        ) : (
            <div className="timeoff-month-grid">
              {months.map((monthStart, index) => {
                const monthName = format(monthStart, "MMMM");
                const monthDays = generateMonthDays(monthStart);
                const firstDayOfMonth = getDay(startOfMonth(monthStart));
                const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

                return (
                  <div key={index} className="timeoff-month-container">
                    <h2>{monthName}</h2>
                    <div className="timeoff-days-grid">
                      {daysOfWeek.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`timeoff-day-name
                          ${day === "Sat" ? "Sat" : ""}
                          ${day === "Sun" ? "Sun" : ""}
                        `}
                        >
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: offset }).map((_, emptyIndex) => (
                        <div
                          key={emptyIndex}
                          className="timeoff-day empty"
                        ></div>
                      ))}
                      {monthDays.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`timeoff-day
      ${isToday(day) ? "today" : ""}
      ${isFuture(day) ? "future" : ""}
      ${getDay(day) === 0 ? "sunday" : ""}
      ${getDay(day) === 6 ? "saturday" : ""}
      ${isBefore(day, today) && !isToday(day) ? "past" : ""}
      ${isOnLeave(day) ? "leave" : ""}
    `}
                          onClick={() => handleDayClick(day)}
                        >
                          <span className="timeoff-day-number">
                            {format(day, "d")}
                          </span>
                          {isOnLeave(day) &&
                            getDay(day) !== 0 &&
                            getDay(day) !== 6 && (
                              <span className="timeoff-umbrella-icon">🏖️</span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
             )}{" "}
            {/* <div className="button-container">
              <DynamicButton
                text="Book Time"
                onClick={togglePopup}
                height="60px"
                width="240px"
                backgroundColor="#28a745"
              />
              <DynamicButton
                text="Leave Taken"
                height="60px"
                width="240px"
                backgroundColor="#28a745"
              />
              <div className="RightSidebarTimeoff"></div>
            </div> */}
          </div>
        </div>
      </div>
      <TimeOffRequestPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        leaveData={leaveData}
        fetchLeavePeriods={fetchLeavePeriods}
      />
    </>
  );
};

export default TimeOff;
