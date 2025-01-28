import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import './SuperAdminExpenseDetails.css'
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import CommonHeader from "../../../components/CommonHeader";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";

import {
  fetchAllExpenseData,
  approveExpense,
  rejectExpense,
} from "../../ApiServices";
import DownloadButton from "../../../Employee/components/DownloadButton";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import IconMapper from "../../../components/IconMapper/IconMapper";

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
      const data = await fetchAllExpenseData();
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
          await approveExpense(selectedDoc.expencesId);
        } else if (selectedStatus === "Rejected") {
          await rejectExpense(selectedDoc.expencesId);
        }

        const updatedDocuments = timesheetData.map((doc) =>
          doc.expencesId === selectedDoc.expencesId
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
      const allexpencesIds = currentItems.map((item) => item.expencesId);
      setSelectedTimesheets(allexpencesIds);
    }
  };

  const handleSelectTimesheet = (expencesId) => {
    if (selectedTimesheets.includes(expencesId)) {
      setSelectedTimesheets(
        selectedTimesheets.filter((id) => id !== expencesId)
      );
    } else {
      setSelectedTimesheets([...selectedTimesheets, expencesId]);
    }
  };

  const handleApproveSelected = async () => {
    if (selectedTimesheets.length > 0) {
      try {
        for (const expencesId of selectedTimesheets) {
          await approveExpense(expencesId);
        }

        const updatedItems = currentItems.map((timesheet) => {
          if (selectedTimesheets.includes(timesheet.expencesId)) {
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

  const isAnySelectedApproved = useMemo(
    () =>
      selectedTimesheets.some((id) =>
        currentItems.find(
          (item) => item.expencesId === id && item.status === "Approved"
        )
      ),
    [selectedTimesheets, currentItems]
  );
  const handleViewFile = (fileName) => {
    const fileBaseUrl = process.env.REACT_APP_API_IMAGE;
    const fileUrl = `${fileBaseUrl}${fileName}`;
    window.open(fileUrl, "_blank");
  };
  const handleDownload = () => {
    const selectedData = timesheetData.filter((document) =>
      selectedTimesheets.includes(document.expencesId)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "EmployeeId,	Name,	ExpenseDate,	ExpenseType,	Amount	,Description,	FileName	,Status,",
      ]
        .concat(
          selectedData.map(
            (item) =>
              `${item.employeeId},${item.employeeName},${item.expenseDate},${item.expenseType},${item.amount},${item.expenseDescription},${item.receiptFileName} ,${item.status}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireflexdExpenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header
        siteName={"Expenses"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["expenses"]}
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
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Expense Date</th>
                    <th> Description</th>
                    <th>Expense Type</th>
                    <th>Amount</th>
                    <th>Receipt File</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((expences) => (
                    <tr key={expences._id}>
                      <td style={{ padding: "5px", textAlign: "left" }}>
                        <Checkbox
                          checked={selectedTimesheets.includes(
                            expences.expencesId
                          )}
                          onChange={() =>
                            handleSelectTimesheet(expences.expencesId)
                          }
                        />
                      </td>
                      <td data-label="Employee ID">{expences.employeeId}</td>
                      <td data-label="EmployeeName">{expences.employeeName}</td>
                      <td data-label="expenseDate">{expences.expenseDate}</td>
                      <td data-label="expenseDescription">
                        {expences.expenseDescription}
                      </td>
                      <td data-label="expenseType">{expences.expenseType}</td>
                      <td data-label="amount">{expences.amount}</td>
                      <td data-label="ReceiptFileName">
                        {expences.receiptFileName ? (
                          <div
                            onClick={() =>
                              handleViewFile(expences.receiptFileName)
                            }
                            className="adminExpensesview-file-button"
                          >
                            View
                            <IconMapper
                              className="ExpensesFilePngicon"
                              iconName={"FilePngIco"}
                            />
                          </div>
                        ) : (
                          "No File"
                        )}
                      </td>
                      <td
                        data-label="Status"
                        onClick={() => handleOpenDialog(expences)}
                      >
                        <StatusBadge status={expences.status} />
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
              className="Policies-download-button-table-data"
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
              Timesheet ID: {selectedDoc?.expencesId}
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
