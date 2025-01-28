import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPaySlipTable.css";
import Header from "../../components/AdminHeader/AdminNavbar";
import Checkbox from "@mui/material/Checkbox";
import { TablePagination } from "@mui/material";
import CommonHeader from "../../../components/CommonHeader/index";
import AdminIconMapper from "../../../components/IconMapper/IconMapper";
import {ProfileImage} from "../../../components/Profile/profile";

const profileImage = "/assets/images/profile.jpg";

const AdminPayslip = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/addemployee");
        setFilteredDocuments(response.data.users || []);
      } catch (error) {
        console.error("Error fetching data:", error);
       
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredDocuments((prevDocs) =>
      prevDocs.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);
  


  const currentDocuments = filteredDocuments.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(currentDocuments.map((doc) => doc._id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedDocuments.map((id) => axios.delete(`/api/employees/${id}`))
      );
      const newFilteredDocuments = filteredDocuments.filter(
        (doc) => !selectedDocuments.includes(doc._id)
      );
      setFilteredDocuments(newFilteredDocuments);
      setSelectedDocuments([]);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error deleting selected documents:", error);
    }
  };


    // Handle folder selection
    // const handleFolderSelect = (event) => {
    //   const files = Array.from(event.target.files);
    //   setSelectedFolder(files); // Store selected files
    //   console.log("Selected Folder Files:", files);
    // };

  return (
    <div>
      <Header
        siteName={" Employee Payslip"}
        profileImage={profileImage}
        showLinks={["emppayslip"]}
      />
      <div className="payslip-table-container">
        <CommonHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteSelected={handleDeleteSelected}
          selectedPayslips={selectedDocuments}
          handleAddClick={handleAddClick}
          showIcons={{ plus: true, trash: true, rotate: true }}
        />
        <div className="payslip-tablebody">
          <table className="payslip-table-data">
            <thead>
              <tr>
                <th style={{ padding: "5px" }}>
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
                <th>Image</th>
                <th>EmployeeName</th>
                <th>EmployeeId</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Payslip</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDocuments.map((doc) => (
                <tr key={doc._id}>
                  <td>
                    <Checkbox
                      checked={selectedDocuments.includes(doc._id)}
                      onChange={() => handleSelectDocument(doc._id)}
                    />
                  </td>
                  <td data-label="Profile">
                    <ProfileImage
                      className="profile-image"
                      src={doc.image || "/assets/images/profile.jpg"}
                      alt="profile"
                      size={"55px"}
                      width={"50px"} height={"50px"}
                    />
                  </td>
                  <td data-label="Image">{doc.image}</td>
                  <td data-label="EmployeeName">{doc.EmployeeName}</td>
                  <td data-label="EmployeeId">{doc.EmployeeId}</td>
                  <td data-label="Role">{doc.role}</td>
                  <td data-label="Department">{doc.department}</td>
                  {/* <td>{doc.salary}</td> */}
                  <td data-label="Email">{doc.email}</td>
                  <td data-label="Download">
                  <div className="payslip-Action-DataButon">
                    <button className="payslip-edit-button">
                      <AdminIconMapper iconName={"download"} isFontAwesome={true} />
                    </button>
                  </div>
                  </td>
                  <td data-label="Action">
                  <div className="payslip-Action-DataButon">
                    <button className="payslip-edit-button">
                      <AdminIconMapper iconName={"pen"} isFontAwesome={true} />
                    </button>

                    <button className="payslip-Text-delete">
                      <AdminIconMapper
                        iconName="Deletebtn"
                        className="payslip-DeletebtnView"
                      />
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            component="div"
            count={filteredDocuments.length}
            page={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={itemsPerPage}
            onRowsPerPageChange={handleItemsPerPageChange}
          />
        </div>
        {isPopupOpen && (
  <div className="admin-popup">
    <div className="admin-popup-content">
      {/* <button className="close-btn" onClick={handleClosePopup}>×</button> */}
      <h2>Import Bulk Employee Folder</h2>
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        // onChange={handleFolderSelect}
      />
      <button onClick={handleClosePopup}>Close</button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminPayslip;
