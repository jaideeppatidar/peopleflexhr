import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../../Employee/components/Sidebar/Sidebar.css"
import IconMapper from "../../../components/IconMapper/IconMapper";
import { logout } from "../../../Employee/Redux/authSlice/authSlice";
import { useDispatch } from "react-redux";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleItemClick = (path) => {
    setActiveItem(path);
    if (isMobileView) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwtToken");
  };


  return (
    <>
      {isMobileView ? (
        <div className={`sidebar-popup ${isOpen ? "open" : ""}`}>
          <div className="sidebar-content">
            <div className="sidebar-header">
              <div className="popup-sidebar1">
                <div onClick={toggleSidebar} className="toggleMenu">
                  <img src="/assets/logo/hirefleX247.com-dark.png" alt="Logo" />
                </div>
                <div className="close-icon-sidebar" onClick={toggleSidebar}>
                  <IconMapper iconName="close" isFontAwesome={true} />
                </div>
              </div>
              <hr />
              <div className="slider2">
                <Link to="/admin/dashboard"
                  className={`list-item ${
                    activeItem === "/admin/dashboard" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("/admin/dashboard")}
                >
                  <Link to="/admin/dashboard" >
                    <IconMapper className="ImageIcons" iconName="ePayslips" />
                    {isOpen && (
                      <span className="list-item-text"> Dashboard</span>
                    )}
                  </Link>
                </Link>

                <Link to="/documents"
                  className={`list-item ${
                    activeItem === "/documents" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("/documents")}
                >
                  <Link to="/documents" >
                    <IconMapper className="ImageIcons" iconName="MyDocuments" />
                    {isOpen && (
                      <span className="list-item-text"> My Documents</span>
                    )}
                  </Link>
                </Link>

                <Link to="/admin/payslip"
                  className={`list-item ${
                    activeItem === "/admin/payslip" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("/admin/payslip")}
                >
                  <Link to="/admin/payslip">
                    <IconMapper className="ImageIcons" iconName="MyDocuments" />
                    {isOpen && <span className="list-item-text"> Payslip</span>}
                  </Link>
                </Link>


                <Link to="/admin/adminpaydata"
                  className={`list-item ${
                    activeItem === "/admin/adminpaydata" ? "active" : ""
                  }`}
                  onClick={() => handleItemClick("/perks")}
                >
                  <Link to="/admin/adminpaydata" >
                    <IconMapper className="ImageIcons" iconName="Perks" />
                    {isOpen && (
                      <span className="list-item-text"> AdminPayData</span>
                    )}
                  </Link>
                </Link>
                
                <Link to="/login"
                className={`list-item ${
                  activeItem === "/login" ? "active" : ""
                }`}
                onClick={() => handleItemClick("/login")}
              >
                <Link to="/login"  onClick={handleLogout}>
                  <IconMapper
                    className="ImageIcons"
                    iconName="Logout"
                  />
                  {isOpen && (
                    <span className="list-item-text">Logout</span>
                  )}
                </Link>
              </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar" style={{ width: isOpen ? "270px" : "68px" }}>
          <div className="sidebar-header">
            <div className="slider1">
              <div onClick={toggleSidebar} className="toggleMenu">
                <li className="list-items">
                  <IconMapper
                    className="ImageIcon"
                    iconName="bars"
                    isFontAwesome={true}
                  />
                  {isOpen && (
                    <img
                      className="LogoImage"
                      src="/assets/logo/hirefleX247.com-dark.png"
                      alt="Logo"
                    />
                  )}
                </li>
              </div>
            </div>
            <div className="slider2">
              <Link to="/admin/dashboard"
                className={`list-item ${
                  activeItem === "/admin/dashboard" ? "active" : ""
                }`}
                onClick={() => handleItemClick("/admin/dashboard")}
              >
                <Link to="/admin/dashboard" >
                  <IconMapper className="ImageIcons" iconName="ePayslips" />
                  {isOpen && <span className="list-item-text"> Dashboard</span>}
                </Link>
              </Link>


              <Link to="/admin/payslip"
                className={`list-item ${
                  activeItem === "/admin/payslip" ? "active" : ""
                }`}
                onClick={() => handleItemClick("/admin/payslip")}
              >
                <Link to="/admin/payslip" >
                  <IconMapper className="ImageIcons" iconName="MyDocuments" />
                  {isOpen && <span className="list-item-text"> Payslip</span>}
                </Link>
              </Link>

              <Link to="/admin/adminpaydata"
                className={`list-item ${
                  activeItem === "/admin/adminpaydata" ? "active" : ""
                }`}
                onClick={() => handleItemClick("/admin/adminpaydata")}
              >
                <Link to="/admin/adminpaydata" >
                  <IconMapper className="ImageIcons" iconName="MyDocuments" />
                  {isOpen && <span className="list-item-text"> Payslip</span>}
                </Link>
              </Link>


            

              
              <Link to="/login"
                className={`list-item ${
                  activeItem === "/login" ? "active" : ""
                }`}
                onClick={() => handleItemClick("/login")}
              >
                <Link to="/login"  onClick={handleLogout}>
                  <IconMapper
                    className="ImageIcons"
                    iconName="Logout"
                  />
                  {isOpen && (
                    <span className="list-item-text">Logout</span>
                  )}
                </Link>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
