import React, { useMemo, useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./Timesheets.css";
import { generateDates, getWeeksOfMonth } from "../../../Utils/helper";
import { submitTimesheets } from "../../EmpApiServices";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { getTimesheetById } from "../../EmpApiServices";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import CommonHeader from "../../../components/CommonHeader";
const Timesheets = ({ updateTotalHours }) => {
  const [loading, setLoading] = useState(true);
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);
  const now = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [week, setWeek] = useState(2);
  const [rows, setRows] = useState(() => generateDates(year, month, week));
  const [totalHours, setTotalHours] = useState(0);

  const [weekRanges, setWeekRanges] = useState(() =>
    getWeeksOfMonth(year, month)
  );
  const [submitted, setSubmitted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const fetchTimesheets = async (employeeId) => {
    setLoading(true);
    try {
      const data = await getTimesheetById(employeeId);
      const updatedRows = rows.map((row) => {
        const matchingData = data.find((item) => item.inDate === row.inDate);
        return matchingData ? { ...row, ...matchingData } : row;
      });
      const totalHours = data.reduce(
        (acc, entry) =>
          entry.status === "Approved" ? acc + (entry.hours || 0) : acc,
        0
      );
      setTotalHours(totalHours);
      if (JSON.stringify(rows) !== JSON.stringify(updatedRows)) {
        setRows(updatedRows);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTimesheets(employeeId);
  }, [employeeId, week, year, rows]);

  useEffect(() => {
    const weeks = getWeeksOfMonth(year, month);
    setWeekRanges(weeks);

    const currentDate = now.toISOString().split("T")[0];

    const currentWeek =
      weeks.findIndex((range) => {
        const [start, end] = range.split(" : ");
        return currentDate >= start && currentDate <= end;
      }) + 1;

    setWeek(currentWeek || 1);
    setRows(generateDates(year, month, currentWeek || 1));
  }, [year, month, now]);

  useEffect(() => {
    if (submitted) {
      const totalHours = rows.reduce(
        (sum, row) => sum + parseFloat(row.hours || 0),
        0
      );
      // updateTotalHours(totalHours);
      setTotalHours(totalHours);
    }
  }, [rows, submitted]);

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value, 10);
    setMonth(selectedMonth);
    setRows(generateDates(year, selectedMonth, week));
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
    setRows(generateDates(selectedYear, month, week));
  };

  const handleWeekChange = (e) => {
    const selectedWeek = parseInt(e.target.value, 10);
    setWeek(selectedWeek);
    setRows(generateDates(year, month, selectedWeek));
  };

  const calculateHours = (inTime, outTime) => {
    const [inHour, inMinute] = inTime.split(":").map(Number);
    const [outHour, outMinute] = outTime.split(":").map(Number);

    let start = new Date();
    start.setHours(inHour, inMinute, 0, 0);

    let end = new Date();
    end.setHours(outHour, outMinute, 0, 0);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diffInMs = end - start;
    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}.${String(minutes).padStart(2, "0")}`;
  };

  const convertTo24HourFormat = (hours, minutes, period) => {
    let convertedHours = parseInt(hours, 10);
    let convertedMinutes = parseInt(minutes, 10) % 60;

    if (period === "PM" && convertedHours !== 12) {
      convertedHours += 12;
    } else if (period === "AM" && convertedHours === 12) {
      convertedHours = 0;
    }

    return `${String(convertedHours).padStart(2, "0")}:${String(
      convertedMinutes
    ).padStart(2, "0")}`;
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    const row = newRows[index];
    row[field] = value;

    const checkIfWeekend = (date) => {
      const day = new Date(date).getDay();
      return day === 0 || day === 6;
    };

    if (!row.inDate) {
      row.inDate = now.toLocaleDateString("en-GB");
    }
    if (!row.outDate) {
      row.outDate = now.toLocaleDateString("en-GB");
    }

    if (checkIfWeekend(row.inDate) || checkIfWeekend(row.outDate)) {
      row.attendanceStatus = "Weekend";
      row.status = "Not Applicable";
      row.hours = "";
      setRows(newRows);
      return;
    }

    if (
      row.inTimeHH !== null &&
      row.inTimeMM !== null &&
      row.inPeriod &&
      row.outTimeHH !== null &&
      row.outTimeMM !== null &&
      row.outPeriod
    ) {
      const inTime = convertTo24HourFormat(
        row.inTimeHH,
        row.inTimeMM,
        row.inPeriod
      );
      const outTime = convertTo24HourFormat(
        row.outTimeHH,
        row.outTimeMM,
        row.outPeriod
      );

      row.hours = calculateHours(inTime, outTime);
      row.attendanceStatus = "Regularized";
      row.status = "Pending";
    } else {
      row.attendanceStatus = "Incomplete";
      row.status = "Pending";
      row.hours = "";
    }

    setRows(newRows); // Update the state
  };

  const handleRowSelect = (index) => {
    setSelectedIndex(index); // Set the selected index when a row is clicked
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    // Ensure a row is selected
    if (selectedIndex === null) {
      toast.error("Please select a row to submit.");
      return;
    }
    const selectedRow = rows[selectedIndex];

    if (
      selectedRow.inTimeHH !== null &&
      selectedRow.inTimeMM !== null &&
      selectedRow.inPeriod &&
      selectedRow.outTimeHH !== null &&
      selectedRow.outTimeMM !== null &&
      selectedRow.outPeriod
    ) {
      const {
        inDate,
        inTimeHH,
        inTimeMM,
        inPeriod,
        outDate,
        outTimeHH,
        outTimeMM,
        outPeriod,
        hours,
        attendanceStatus,
        status,
      } = selectedRow;

      const payload = {
        employeeId,
        employeeName,
        inDate: formatDate(inDate),
        inTimeHH: parseInt(inTimeHH, 10),
        inTimeMM: String(inTimeMM).padStart(2, "0"),
        inPeriod,
        outDate: formatDate(outDate),
        outTimeHH: parseInt(outTimeHH, 10),
        outTimeMM: String(outTimeMM).padStart(2, "0"),
        outPeriod,
        hours: parseFloat(hours),
        attendanceStatus,
        status,
      };

      try {
        await submitTimesheets(payload);
        toast.success("Timesheet submitted successfully");
        setTimeout(async () => {
          await fetchTimesheets(employeeId);
        }, 3000);
      } catch (error) {
        toast.error("Error submitting timesheet");
      }
    } else {
      toast.error("Selected row is invalid.");
    }
  };
  const handleRefreshClick = () => {
    fetchTimesheets(employeeId);
  };

  const convertToCSV = (rows) => {
    const header = [
      "Employee Name",
      "In Date",
      "In Time (HH)",
      "In Time (MM)",
      "AM/PM",
      "Out Date",
      "Out Time (HH)",
      "Out Time (MM)",
      "AM/PM",
      "Attendance",
      "Status ",
      "Hours",
    ];

    const rowsData = rows.map((row) => [
      row.employeeName,
      row.inDate,
      row.inTimeHH,
      row.inTimeMM,
      row.inPeriod,
      row.outDate,
      row.outTimeHH,
      row.outTimeMM,
      row.outPeriod,
      row.attendanceStatus,
      row.status,
      row.hours,
    ]);

    const csvArray = [header, ...rowsData];
    return csvArray.map((row) => row.join(",")).join("\n");
  };
  const downloadCSV = (csvContent, filename = "timesheet.csv") => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const handleDownload = () => {
    const csvContent = convertToCSV(rows);
    downloadCSV(csvContent);
  };

  return (
    <div className="TimeSheet-table-container">
      <div className="timesheet-header">
        <h2>Timesheet</h2>
      </div>
      <div className="dropdowns">
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={handleYearChange} label="Year">
            {[2022, 2023, 2024, 2025].map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={handleMonthChange} label="Month">
            {Array.from({ length: 12 }).map((_, i) => (
              <MenuItem key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Week</InputLabel>
          <Select value={week} onChange={handleWeekChange} label="Week">
            {weekRanges.map((range, i) => (
              <MenuItem key={i} value={i + 1}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="TotalReported">
        <DynamicButton
          text="Copy Reports Download "
          onClick={handleDownload}
          height="40px"
          backgroundColor="#6674a9"
          color="white"
        />
        <div className="indicators">
          <p>Total Reported Hrs: {totalHours.toFixed(2)}</p>
        </div>
      </div>
      <>
        <CommonHeader
          showIcons={{ plus: false, trash: true, rotate: true, PdfIcon: false }}
          handleRefreshClick={handleRefreshClick}
        />
      </>
    
        <div className="TimeSheet-tablebody">
          <table className="TimeSheet-table-data">
            <thead>
              <tr>
                <th className="timesheetth">In Date</th>
                <th className="timesheetth">In Time (HH)</th>
                <th className="timesheetth">In Time (MM)</th>
                <th className="timesheetth">AM/PM</th>
                <th className="timesheetth">Out Date</th>
                <th className="timesheetth">Out Time (HH)</th>
                <th className="timesheetth">Out Time (MM)</th>
                <th className="timesheetth">AM/PM</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Hours </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowSelect(index)}
                  className={`row ${selectedIndex === index ? "selected" : ""}`}
                >
                  <td data-label="InDate">{row.inDate}</td>

                  <td data-label="inTimeHH">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      required
                      // disabled={isFuture}
                    >
                      <InputLabel>HH</InputLabel>
                      <Select
                        value={row.inTimeHH || ""}
                        onChange={(e) =>
                          handleInputChange(index, "inTimeHH", e.target.value)
                        }
                        label="HH"
                        size="small"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <MenuItem
                              key={hour}
                              value={hour < 10 ? `0${hour}` : hour}
                            >
                              {hour < 10 ? `0${hour}` : hour}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td data-label="inTimeMM">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      // disabled={isFuture}
                    >
                      <InputLabel>MM</InputLabel>
                      <Select
                        value={
                          row.inTimeMM !== null && row.inTimeMM !== undefined
                            ? row.inTimeMM
                            : ""
                        } // Ensure 0 is treated as valid
                        onChange={(e) =>
                          handleInputChange(index, "inTimeMM", e.target.value)
                        }
                        label="MM"
                        size="small"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <MenuItem key={minute} value={minute}>
                              {minute}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td data-label="AM/PM">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      // disabled={isFuture}
                    >
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        sx={{ height: "40px", width: "150px" }}
                        value={row.inPeriod || ""}
                        onChange={(e) =>
                          handleInputChange(index, "inPeriod", e.target.value)
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </td>

                  {/* <td data-label="OutDate">{row.outDate}</td> */}
                  <td data-label="OutDate">
                    <input
                      type="date"
                      value={row.outDate || ""}
                      onChange={(e) =>
                        handleInputChange(index, "outDate", e.target.value)
                      }
                      className="TimeSheet-date-input"
                    />
                  </td>
                  <td data-label="outTimeHH">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      // disabled={isFuture}
                    >
                      <InputLabel>HH</InputLabel>
                      <Select
                        value={row.outTimeHH || ""}
                        onChange={(e) =>
                          handleInputChange(index, "outTimeHH", e.target.value)
                        }
                        label="HH"
                        size="small"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (hour) => (
                            <MenuItem key={hour} value={hour}>
                              {hour}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td data-label="outTimeMM">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      // disabled={isFuture}
                    >
                      <InputLabel>MM</InputLabel>
                      <Select
                        value={
                          row.outTimeMM !== null && row.outTimeMM !== undefined
                            ? row.outTimeMM
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(index, "outTimeMM", e.target.value)
                        }
                        label="MM"
                        size="small"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(
                          (minute) => (
                            <MenuItem key={minute} value={minute}>
                              {minute}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </td>

                  <td data-label="AM/PM">
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="TimeSheet-custom-form-control"
                      // disabled={isFuture}
                    >
                      <InputLabel>AM/PM</InputLabel>
                      <Select
                        sx={{ height: "40px", width: "150px" }}
                        value={row.outPeriod || ""}
                        onChange={(e) =>
                          handleInputChange(index, "outPeriod", e.target.value)
                        }
                        label="AM/PM"
                      >
                        <MenuItem value="AM">AM</MenuItem>
                        <MenuItem value="PM">PM</MenuItem>
                      </Select>
                    </FormControl>
                  </td>

                  <td data-label="attendanceStatus">
                    {row.attendanceStatus || ""}
                  </td>
                  <td data-label="status">
                    {" "}
                    <StatusBadge status={row.status} />
                  </td>
                  <td data-label="Hrs">{row.hours || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
      <div className="timesheetsubmit">
        <DynamicButton
          text="Submit Timesheet"
          onClick={handleSubmit}
          height="40px"
          backgroundColor="#6674a9"
          color="white"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Timesheets;
