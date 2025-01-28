import React, { useState, useEffect } from "react";
import "../DocumentSuperAdmin/SuperAdminDocumentPopup.css";
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import CommonHeader from "../../../components/CommonHeader/index";
import { Link } from "react-router-dom";
import { fetchAllExpenseData } from "../../ApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
const ITEMS_PER_PAGE = 6;

const AdminTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const getUniqueTimesheets = (data) => {
    const uniqueTimesheets = {};
    data.forEach((timesheet) => {
      if (!uniqueTimesheets[timesheet.employeeId]) {
        uniqueTimesheets[timesheet.employeeId] = timesheet;
      }
    });
    return Object.values(uniqueTimesheets);
  };

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const data = await fetchAllExpenseData();
      const uniqueData = getUniqueTimesheets(data);
      setTimesheetData(uniqueData);
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
    const filteredData = timesheetData.filter((timesheet) => {
      const matchesSearch = timesheet.employeeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter
        ? timesheet.status === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    });
    const newOffset = page * rowsPerPage;
    setCurrentItems(filteredData.slice(newOffset, newOffset + rowsPerPage));
  }, [searchQuery, page, rowsPerPage, timesheetData, statusFilter]);

  const handleSelectTimesheet = (id) => {
    setSelectedTimesheets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTimesheets(currentItems.map((item) => item._id));
    } else {
      setSelectedTimesheets([]);
    }
  };

  const handleDelete = () => {
    const newTimesheetData = timesheetData.filter(
      (timesheet) => !selectedTimesheets.includes(timesheet._id)
    );
    setTimesheetData(newTimesheetData);
    setSelectedTimesheets([]);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleRefreshClick = () => {
    fetchTimesheets();
  };
  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Expenses"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["expense"]}
      />
      <div className="AdminDocument-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          handleDeleteSelected={handleDelete}
          selectedPayslips={selectedTimesheets}
          showIcons={{ plus: false, trash: false, rotate: true }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedTimesheets}
          setStatusFilter={setStatusFilter}
          // statusFilter={statusFilter}
          // showStatusFilter={true}
          // showCalendor={true}
          showSearchFilter={true}
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
                </tr>
              </thead>
              <tbody>
                {currentItems.map((timesheet) => (
                  <tr key={timesheet._id}>
                    <td style={{ padding: "5px", textAlign: "left" }}>
                      <Checkbox
                        checked={selectedTimesheets.includes(timesheet._id)}
                        onChange={() => handleSelectTimesheet(timesheet._id)}
                      />
                    </td>
                    <td data-label="Emp_ID">
                      <Link
                        to={`/superadmin/expenses/${timesheet.employeeId}`}
                      >
                        {timesheet.employeeId}
                      </Link>
                    </td>
                    <td data-label="Emp_Name">
                      <Link to={"/superadmin/expenses"}>
                        {timesheet.employeeName}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}{" "}
        <TablePagination
          component="div"
          count={timesheetData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminTimesheet;
