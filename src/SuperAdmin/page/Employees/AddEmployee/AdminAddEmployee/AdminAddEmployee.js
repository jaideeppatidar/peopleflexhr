import React, { useEffect, useState } from "react";
import "./AdminAddEmployee.css";
import Header from "../../../../components/SuperAdminNavbar/SuperAdminNavbar";
import CommonHeader from "../../../../../components/CommonHeader/index";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DynamicButton from "../../../../../components/DynamicButton/DynamicButton";
import { fetchEmployeeDataAll } from "../../../../ApiServices";
import { toast } from "react-toastify";
import LinearIndeterminate from "../../../../../components/Linearindeterminate/Linearindeterminate";

const AddAdminEmployee = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployeeDataAll();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.success("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handlePopupOpen = (employee) => {
    setSelectedEmployee(employee);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedEmployee(null);
  };
  const handleRefreshClick = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <div className="admin-add-employee">
      <Header siteName="Add Team Member" showLinks={["allemployees"]} />
      <div className="emp-content-container">
        <CommonHeader
          showIcons={{ plus: false, trash: true, rotate: true }}
          handleRefreshClick={handleRefreshClick}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="emp-teams-section">
            <Link to="/superadmin/empdetails">
              <DynamicButton
                text="Add Employee"
               
                height="40px"
                width="230px"
                backgroundColor="#6674a9"
                color="#ffffff"
              />
            </Link>
            <div className="AddEmployeeHeadingText">All Employees</div>
            <div className="emp-team-profiles">
              {employees.map((employee) => (
                <div key={employee.employeeId} className="emp-team-card">
                  <div className="emp-team-profile">
                    <div className="profile-image-container">
                      {employee.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_IMAGE}/${employee.image}`}
                          alt={employee.employeeName}
                          className="emp-team-profile-img"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <span className="profile-initials">
                          {employee.employeeName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="emp-team-info">
                      <h3>{employee.employeeName}</h3>
                      <p className="emp-role">{employee.designation}</p>
                      <div className="emp-profile-actions">
                        <Link
                          to={`/superadmin/personal-information/${employee.employeeId}`}
                          className="emp-view-profile-link"
                        >
                          View Profile
                        </Link>
                        <VisibilityIcon
                          onClick={() => handlePopupOpen(employee)}
                          className="visibility-icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}{" "}
      </div>
      {showPopup && selectedEmployee && (
        <div className="emp-modal-overlay" onClick={handlePopupClose}>
          <div
            className="emp-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-modal-header">
              <h2>Employee Quick View</h2>
              <CloseIcon
                onClick={handlePopupClose}
                className="emp-modal-close-icon"
              />
            </div>
            <div className="emp-modal-body">
              <div className="emp-modal-left">
                <div className="profile-image-container">
                  {selectedEmployee.image ? (
                    <img
                      src={selectedEmployee.image}
                      alt={selectedEmployee.employeeName}
                      className="emp-team-profile-img"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span className="profile-initials">
                      {selectedEmployee.employeeName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  )}
                </div>
              </div>
              <div className="emp-modal-right">
                <h3>{selectedEmployee.employeeName}</h3>
                <p>{selectedEmployee.designation || "Role not available"}</p>
                <p>
                  <EmailIcon />{" "}
                  {selectedEmployee.email || "Email not available"}
                </p>
                <p>
                  <PhoneIcon />{" "}
                  {selectedEmployee.mobile || "Phone not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAdminEmployee;
