import React, { useState, useEffect, useMemo } from "react";
import "../../../components/css/Table.css";
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import Checkbox from "@mui/material/Checkbox";
import { TablePagination } from "@mui/material";
import CommonHeader from "../../../components/CommonHeader/index";
import DownloadButton from "../../../Employee/components/DownloadButton";
import {
  approveTimeOff,
  fetchalltimeoff,
  rejectTimeOff,
} from "../../ApiServices";
import "./SuperAdminTimeOff.css";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";

const profileImage = "/assets/images/profile.jpg";

const AdminTimeOff = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange] = useState({ fromDate: "", toDate: "" });
  const [open, setOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");

  const loadTimeOffRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchalltimeoff();
      setFilteredDocuments(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTimeOffRequests();

    const savedStatus = localStorage.getItem("selectedStatus");
    setSelectedStatus(savedStatus || "Pending");
  }, []);

  const filteredData = useMemo(() => {
    return filteredDocuments
      .filter((doc) =>
        searchTerm
          ? doc.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((doc) => (statusFilter ? doc.status === statusFilter : true))
      .filter((doc) => {
        const startDates = new Date(doc.startDate);
        const from = dateRange.fromDate ? new Date(dateRange.fromDate) : null;
        const to = dateRange.toDate ? new Date(dateRange.toDate) : new Date();
        return !from || (startDates >= from && startDates <= to);
      });
  }, [filteredDocuments, searchTerm, statusFilter, dateRange]);
  

  const currentDocuments = filteredData.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePageChange = (event, newPage) => setCurrentPage(newPage);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleSelectAll = (event) => {
    setSelectedDocuments(
      event.target.checked ? currentDocuments.map((doc) => doc.timeoffId) : []
    );
  };

  const handleSelectDocument = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setFilteredDocuments((prev) =>
      prev.filter((doc) => !selectedDocuments.includes(doc.timeoffId))
    );
    setSelectedDocuments([]);
    setCurrentPage(0);
  };

  const handleOpenDialog = (doc) => {
    setSelectedDoc(doc);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDoc(null);
  };

  const handleConfirm = async () => {
    if (selectedStatus) {
      try {
        if (selectedStatus === "Approved") {
          await approveTimeOff(selectedDoc.timeoffId);
        } else if (selectedStatus === "Rejected") {
          await rejectTimeOff(selectedDoc.timeoffId);
        }
        const updatedDocuments = filteredDocuments.map((doc) =>
          doc.timeoffId === selectedDoc.timeoffId
            ? { ...doc, status: selectedStatus }
            : doc
        );

        setFilteredDocuments(updatedDocuments);
        handleCloseDialog();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };
  const handleRefreshClick = () => {
    loadTimeOffRequests();
  };
  const handleDownload = () => {
  
    const selectedData = filteredDocuments.filter((document) =>
      selectedDocuments.includes(document.timeoffId)
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Employee ID,Start Date,End Date,Partial Days,Type,Status"]
        .concat(
          selectedData.map(
            (item) =>
              `${item.employeeId || ""},${item.startDate || ""},${
                item.endDate || ""
              },${item.partialDays || ""},${item.type || ""},${
                item.status || ""
              }`
          )
        )
        .join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireflexLeave.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  return (
    <div>
      <Header
        siteName="Time Off-Book"
        profileImage={profileImage}
        showLinks={["timeoff"]}
      />
      <div className="timeoff-table-container">
        <CommonHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteSelected={handleDeleteSelected}
          selectedPayslips={selectedDocuments}
          showIcons={{ plus: false, trash: true, rotate: true }}
          selectedDocuments={selectedDocuments}
          currentDocuments={currentDocuments}
          handleSelectAll={handleSelectAll}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showStatusFilter={true}
          showCalendar={true}
          showSearchFilter={true}
          handleRefreshClick={handleRefreshClick}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="timeoff-tablebody">
            <table className="timeoff-table-data">
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      checked={
                        selectedDocuments.length === currentDocuments.length &&
                        currentDocuments.length > 0
                      }
                      indeterminate={
                        selectedDocuments.length > 0 &&
                        selectedDocuments.length < currentDocuments.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Employee ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Partial Days</th>
                  <th>Reason</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map((doc ) => (
                  <tr key={doc.timeoffId}>
                    <td
                      className="w-[10px]"
                      style={{ padding: "5px", textAlign: "left" }}
                    >
                      <Checkbox
                        checked={selectedDocuments.includes(doc.timeoffId)}
                        onChange={() => handleSelectDocument(doc.timeoffId)}
                      />
                    </td>
                    <td data-label="Employee ID">{doc.employeeId}</td>
                    <td data-label="Start Date">{doc.startDate}</td>
                    <td data-label="End Date">{doc.endDate}</td>
                    <td data-label="Partial Days">{doc.partialDays}</td>
                    <td data-label="Reason">{doc.reason}</td>

                    <td data-label="Type">{doc.type}</td>
                    <td
                      data-label="Status"
                      onClick={() => handleOpenDialog(doc)}
                     
                    >
                      
                    <StatusBadge status={doc.status} />

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="timeoff-pagination-table-container">
              <DownloadButton
                onClick={handleDownload}
                className="timeoff-download-button-table-data"
              />
              <div className="flex gap-3">
                <TablePagination
                  component="div"
                  count={filteredData.length}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  rowsPerPage={itemsPerPage}
                  rowsPerPageOptions={[6, 10, 20]}
                  onRowsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        )}{" "}
        <div
          className={`fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                Change Status for {selectedDoc?.employeeId}
              </h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Leave ID: {selectedDoc?.timeoffId}
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
    </div>
  );
};

export default AdminTimeOff;
