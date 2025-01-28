import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
const Navbar = ({ siteName, showLinks }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h2>{siteName}</h2>
      </div>
      <div className="navbar-right">
        <nav className="gap-7px">
          <Link to="/dashboard" className="Epmnav-link">
            <div className="gap-2">
              <IconMapper iconName={"home"} isFontAwesome={true} />
            </div>
            Home
          </Link>
          {showLinks.includes("documents") && (
            <Link to="/documents" className="Epmnav-link">
              <div>/</div>
              Documents
            </Link>
          )}
            {showLinks.includes("meeting") && (
            <Link to="/meeting" className="Epmnav-link">
              <div>
               /
              </div>
              Dialogues
            </Link>
          )}
          {showLinks.includes("payslips") && (
            <Link to="/payslips" className="Epmnav-link">
              <div>
               /
              </div>
              Payslips
            </Link>
          )}
          {showLinks.includes("perks") && (
            <Link to="/perks" className="Epmnav-link">
              <div>
               /
              </div>
              perks
            </Link>
          )}
          {showLinks.includes("policies") && (
            <Link to="/policies" className="Epmnav-link">
              <div>
              /
              </div>
              policies
            </Link>
          )}
          {showLinks.includes("expenses") && (
            <Link to="/expenses" className="Epmnav-link">
              <div>
               /
              </div>
              expenses
            </Link>
          )}
          {showLinks.includes("timeoff") && (
            <Link to="/timeoff" className="Epmnav-link">
              <div>
              /
              </div>
              timeoff
            </Link>
          )}
          {showLinks.includes("timesheets") && (
            <Link to="/timesheets" className="Epmnav-link">
              <div>
              /
              </div>
              timesheets
            </Link>
          )}
          {showLinks.includes("account") && (
            <Link to="/account" className="Epmnav-link">
              <div>
              /
              </div>
              account
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};
export default Navbar;
