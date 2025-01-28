import React, { useState } from "react";
import "./Headeradmin.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import { Link } from "react-router-dom";
const Header = ({ isOpen, toggleSidebar }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const closePopup = () => {
    if (isPopupOpen) {
      setIsPopupOpen(false);
    }
  };

  return (
    <>
      {" "}
      <header className="SuperAdmin-header" onClick={closePopup}>
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
            alt="HireFlex 247 dark logo"
          />

          {!isOpen ? (
            <img
              onClick={toggleSidebar}
              className="HeaderLogoView"
              src="/assets/logo/hirefleX247.com-dark.png"
              alt="HireFlex 247 dark logo"
            />
          ) : (
            <div className="hembarIcon">
              <IconMapper iconName={"bars"} isFontAwesome={false} />
            </div>
          )}
        </div>
        <div className="header-right">
         
         
            <Link to="#"  className="teams">Team</Link>
          </div>
       
      </header>
    </>
  );
};

export default Header;
