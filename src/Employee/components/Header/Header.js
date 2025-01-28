import React, { useEffect, useState } from "react";
import "./Header.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import { Link } from "react-router-dom";
import { logout } from "../../Redux/authSlice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeById } from "../../EmpApiServices";

const Header = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const togglePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
    setIsSettingsOpen(false);
  };



  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { employeeId ,image} = useSelector((state) => state.auth.user);

  const fetchEmployeeData = async (id) => {
    setLoading(true);
    try {
      const data = await fetchEmployeeById(id);
      const employeeArray = Array.isArray(data) ? data : [data];
      setFilteredDocuments(employeeArray.filter(Boolean));
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setFilteredDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData(employeeId);
    }
  }, [employeeId]);
  


  const closePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setIsSettingsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("User");
    localStorage.removeItem("token");
  };
  return (
    <header className="employee-header" onClick={closePopup}>
      <div className="header-left">
        <IconMapper
          iconName={"bars"}
          isFontAwesome={true}
          className="IconHembar"
          onClick={toggleSidebar}
        />
        <img
          className="logomedia"
          src="/assets/logo/hirefleX247.com-dark.png"
          alt="hirefleX247.com-dark"
        />
        {!isOpen ? (
          <img
            onClick={toggleSidebar}
            className="HeaderLogoView"
            src="/assets/logo/hirefleX247.com-dark.png"
            alt="hirefleX247.com-dark"
          />
        ) : (
          <div className="hembarIcon">
            <IconMapper iconName={"bars"} isFontAwesome={false} />
          </div>
        )}
      </div>
      <div className="header-right">
        <div className="name-container" onClick={togglePopup}>
        <div >
      {loading ? (
        <div>Loading...</div>
      ) : (
        filteredDocuments.map((employee, index) => (
          <div key={index} className="name-container">
            <h4>{employee.employeeName}</h4>
            <div className="profile-image-Header">
              {employee.image ? (
                <img
                src={`${process.env.REACT_APP_API_IMAGE}/${image}?t=${new Date().getTime()}`}
                  alt={employee.employeeName}
                  className="EmployeeImageProfile"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="profile-initials">
                  {(employee.employeeName || "")
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>

          {isPopupOpen && (
            <div className="employee_popup">
              <ul>
                <Link to="/profile" className="employee_popup-link">
                  <IconMapper iconName="account" isFontAwesome={true} /> Account
                </Link>
                <Link to="#" className="employee_popup-link">
                  <IconMapper iconName="inbox" isFontAwesome={true} /> Inbox
                </Link>
                <Link to="#" className="employee_popup-link">
                  <IconMapper iconName="settings" isFontAwesome={true} />{" "}
                  Settings
                </Link>
                <Link
                  to="/login"
                  className="employee_popup-link"
                  onClick={handleLogout}
                >
                  <IconMapper iconName="logout" isFontAwesome={true} /> Logout
                </Link>
              </ul>

              {isSettingsOpen && (
                <div className="settings-popup-wrapper">
                  <div className="settings-popup">
                    <ul>
                      <Link to="/profile" className="popup-link">
                        <IconMapper iconName="globe" isFontAwesome={true} />{" "}
                        Language
                      </Link>
                      <Link to="/password" className="popup-link">
                        <IconMapper iconName="lock" isFontAwesome={true} />{" "}
                        Password
                      </Link>
                      <Link to="/performance" className="popup-link">
                        <IconMapper iconName="chart-bar" isFontAwesome={true} />{" "}
                        Performance
                      </Link>
                      <Link to="/about" className="popup-link">
                        <IconMapper
                          iconName="info-circle"
                          isFontAwesome={true}
                        />{" "}
                        About
                      </Link>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
