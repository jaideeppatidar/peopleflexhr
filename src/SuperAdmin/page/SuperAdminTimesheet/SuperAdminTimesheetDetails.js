import React, { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";

import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import CommonHeader from "../../../components/CommonHeader";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";

import {
  getAllTimesheets,
  approveTimesheet,
  rejectTimesheet,
} from "../../ApiServices";
import DownloadButton from "../../../Employee/components/DownloadButton";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";

const ITEMS_PER_PAGE = 6;

const AdminTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);

  const { employeeId } = useParams();

  const profileImage = "/assets/images/profile.jpg";

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const data = await getAllTimesheets();
      setTimesheetData(data);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  useEffect(() => {
    let filteredData = timesheetData;

    if (employeeId) {
      filteredData = timesheetData.filter(
        (timesheet) => timesheet.employeeId === employeeId
      );
    }

    const newOffset = page * rowsPerPage;
    setCurrentItems(filteredData.slice(newOffset, newOffset + rowsPerPage));
  }, [page, rowsPerPage, timesheetData, employeeId]);

  const handleRefreshClick = () => {
    fetchTimesheets();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDoc(null);
  };

  const handleOpenDialog = (doc) => {
    setSelectedDoc(doc);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedStatus) {
      try {
        if (selectedStatus === "Approved") {
          await approveTimesheet(selectedDoc.timesheetId);
        } else if (selectedStatus === "Rejected") {
          await rejectTimesheet(selectedDoc.timesheetId);
        }

        const updatedDocuments = timesheetData.map((doc) =>
          doc.timesheetId === selectedDoc.timesheetId
            ? { ...doc, status: selectedStatus }
            : doc
        );

        setTimesheetData(updatedDocuments);
        toast.success("Status updated successfully!");
        handleCloseDialog();
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Error updating status: " + error.message);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedTimesheets.length === currentItems.length) {
      setSelectedTimesheets([]);
    } else {
      const allTimesheetIds = currentItems.map((item) => item.timesheetId);
      setSelectedTimesheets(allTimesheetIds);
    }
  };

  const handleSelectTimesheet = (timesheetId) => {
    if (selectedTimesheets.includes(timesheetId)) {
      setSelectedTimesheets(
        selectedTimesheets.filter((id) => id !== timesheetId)
      );
    } else {
      setSelectedTimesheets([...selectedTimesheets, timesheetId]);
    }
  };

  const handleApproveSelected = async () => {
    if (selectedTimesheets.length > 0) {
      try {
        for (const timesheetId of selectedTimesheets) {
          await approveTimesheet(timesheetId);
        }

        const updatedItems = currentItems.map((timesheet) => {
          if (selectedTimesheets.includes(timesheet.timesheetId)) {
            return {
              ...timesheet,
              status: "Approved",
            };
          }
          return timesheet;
        });

        setCurrentItems(updatedItems);
        setSelectedTimesheets([]);
        toast.success("Selected timesheets Approved successfully!");
      } catch (error) {
        console.error("Error approving timesheets:", error);
        toast.error("Failed to approve timesheets. Please try again.");
      }
    } else {
      toast.warning("No timesheets selected for approval.");
    }
  };
  const handleDownload = () => {
    // Filter the selected data based on selected IDs
    const selectedData = timesheetData.filter(
      (document) => selectedTimesheets.includes(document.timesheetId) // Assuming 'id' is the unique identifier
    );

    // Create CSV header
    const csvHeaders = [
      "ID",
      "Name",
      "InDate",
      "InTimeHH",
      "InTimeMM",
      "InPeriod",
      "OutDate",
      "OutTimeHH",
      "OutTimeMM",
      "OutPeriod",
      "Hours",
      "PresentStatus",
    ];

    // Map through selectedData and construct CSV rows
    const csvRows = selectedData.map((item) =>
      [
        item.employeeId || "",
        item.employeeName || "",
        item.inDate || "",
        item.inTimeHH || "",
        item.inTimeMM || "",
        item.inPeriod || "",
        item.outDate || "",
        item.outTimeHH || "",
        item.outTimeMM || "",
        item.outPeriod || "",
        item.hours || "",
        item.presentStatus || "",
      ].join(",")
    );

    // Combine header and rows into CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [csvHeaders.join(","), ...csvRows].join("\n");

    // Encode the URI and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendanceData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAnySelectedApproved = useMemo(
    () =>
      selectedTimesheets.some((id) =>
        currentItems.find(
          (item) => item.timesheetId === id && item.status === "Approved"
        )
      ),
    [selectedTimesheets, currentItems]
  );

  return (
    <div>
      <Header
        siteName={"Timesheet"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["timesheet"]}
      />
      <div>
        <div className="AdminDocument-table-container">
          <CommonHeader
            showSearchFilter={true}
            showIcons={{ plus: false, trash: false, rotate: true }}
            handleRefreshClick={handleRefreshClick}
          />
          {loading ? (
            <LinearIndeterminate />
          ) : (
            <div className="AdminDocument-tablebody">
              <table className="AdminDocument-table-data">
                <thead>
                  <tr>
                    <th style={{ padding: "5px" }}>
                      <Checkbox
                        checked={
                          selectedTimesheets.length === currentItems.length &&
                          currentItems.length > 0
                        }
                        indeterminate={
                          selectedTimesheets.length > 0 &&
                          selectedTimesheets.length < currentItems.length
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th> Name</th>
                    <th>InDate</th>
                    <th>InTimeHH</th>
                    <th>InTimeMM</th>
                    <th>InPeriod</th>
                    <th>OutDate</th>
                    <th>OutTimeHH</th>
                    <th>OutTimeMM</th>
                    <th>OutPeriod</th>
                    <th>Hours</th>
                    <th>PresentStatus</th>
                    <th style={{ marginLeft: "1px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((timesheet) => (
                    <tr key={timesheet._id}>
                      <td style={{ padding: "5px", textAlign: "left" }}>
                        <Checkbox
                          checked={selectedTimesheets.includes(
                            timesheet.timesheetId
                          )}
                          onChange={() =>
                            handleSelectTimesheet(timesheet.timesheetId)
                          }
                        />
                      </td>
                      <td data-label="Employee ID">
                        <Link
                          to={`/superadmin/timesheets/${timesheet.employeeId}`}
                        >
                          {timesheet.employeeId}
                        </Link>
                      </td>
                      <td data-label="EmployeeName">
                        {timesheet.employeeName}
                      </td>
                      <td data-label="InDate">{timesheet.inDate}</td>
                      <td data-label="InTimeHH">{timesheet.inTimeHH}</td>
                      <td data-label="InTimeMM">{timesheet.inTimeMM}</td>
                      <td data-label="InPeriod">{timesheet.inPeriod}</td>
                      <td data-label="OutDate">{timesheet.outDate}</td>
                      <td data-label="OutTimeHH">{timesheet.outTimeHH}</td>
                      <td data-label="OutTimeMM">{timesheet.outTimeMM}</td>
                      <td data-label="OutPeriod">{timesheet.outPeriod}</td>
                      <td data-label="Hours">{timesheet.hours}</td>
                      <td data-label="PresentStatus">
                        {timesheet.attendanceStatus}
                      </td>
                      <td
                        data-label="Status"
                        onClick={() => handleOpenDialog(timesheet)}
                      >
                        <StatusBadge status={timesheet.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
            }}
          >
            {isAnySelectedApproved && (
              <DynamicButton
                text="Approve Selected Timesheet"
                height="40px"
                onClick={handleApproveSelected}
                width="250px"
                color="black"
                backgroundColor="#6674a9"
              />
            )}
            <DownloadButton
              onClick={handleDownload}
              className="timeoff-download-button-table-data"
            />
            <TablePagination
              component="div"
              count={timesheetData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
          <ToastContainer />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">
              Change Status for {selectedDoc?.employeeName}
            </h3>
          </div>
          <div className="mb-6">
            <p className="text-gray-700">
              Timesheet ID: {selectedDoc?.timesheetId}
            </p>
            <p className="text-gray-700 mt-2">Select status:</p>
            <div className="flex items-center space-x-4 mt-4">
              <button
                className={`px-4 py-2 rounded-md focus:outline-none transition duration-300 ${
                  selectedStatus === "Approved"
                    ? "bg-[#d4edda] text-[#155724] font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedStatus("Approved")}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 rounded-md focus:outline-none transition duration-300 ${
                  selectedStatus === "Rejected"
                    ? "bg-[#f8d7da] text-[#721c24] font-bold"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedStatus("Rejected")}
              >
                Rejected
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            {selectedStatus && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600 transition duration-300"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            )}
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none hover:bg-gray-300 transition duration-300"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTimesheet;
