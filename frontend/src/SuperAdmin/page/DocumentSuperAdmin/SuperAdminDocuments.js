import React, { useState, useEffect } from "react";
import "../DocumentSuperAdmin/SuperAdminDocumentPopup.css";
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import CommonHeader from "../../../components/CommonHeader/index";
import { Link } from "react-router-dom";
import { fetchEmployeeDocuments } from "../../ApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
const ITEMS_PER_PAGE = 6;

const AdminDocumentPage = () => {
  const [documetData, setDocumentData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedTimesheets, setSelectedTimesheets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const getUniqueDocument = (data) => {
    const uniqueDocument = {};
    data.forEach((documet) => {
      if (!uniqueDocument[documet.employeeId]) {
        uniqueDocument[documet.employeeId] = documet;
      }
    });
    return Object.values(uniqueDocument);
  };

  const fetchDocumentData = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployeeDocuments();
      const uniqueData = getUniqueDocument(data);
      setDocumentData(uniqueData);
    } catch (error) {
      console.error("Failed to fetch timesheets:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDocumentData();
  }, []);

  useEffect(() => {
    const filteredData = documetData.filter((timesheet) => {
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
  }, [searchQuery, page, rowsPerPage, documetData, statusFilter]);

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
    const newTimesheetData = documetData.filter(
      (timesheet) => !selectedTimesheets.includes(timesheet._id)
    );
    setDocumentData(newTimesheetData);
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
    fetchDocumentData();
  };
  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Documents"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["documentss"]}
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
                {currentItems.map((document) => (
                  <tr key={document._id}>
                    <td style={{ padding: "5px", textAlign: "left" }}>
                      <Checkbox
                        checked={selectedTimesheets.includes(document._id)}
                        onChange={() => handleSelectTimesheet(document._id)}
                      />
                    </td>
                    <td data-label="Emp_ID">
                      <Link to={`/superadmin/document/${document.employeeId}`}>
                        {document.employeeId}
                      </Link>
                    </td>
                    <td data-label="Emp_Name">
                      <Link to={"/superadmin/document"}>
                        {document.employeeName}
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
          count={documetData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminDocumentPage;
