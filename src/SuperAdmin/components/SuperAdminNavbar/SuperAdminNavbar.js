import React from "react";
import { Link } from "react-router-dom";
import "./SuperAdminNavbar.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
const Navbar = ({ siteName, showLinks }) => {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <h2>{siteName}</h2>
            </div>
            <div className="navbar-right">
                <nav className="gap-7px">
                    <Link to="/superadmin/dashboard" className="nav-link">
                        <div className="gap-2">
                            <IconMapper iconName={"home"} isFontAwesome={true} />
                        </div>
                        Home
                    </Link>
                    {showLinks.includes("allemployees") && (
                        <Link to="/superadmin/allemployees" className="nav-link">
                            <div>
                              /
                            </div>
                            All Employees 
                        </Link>
                    )}
                     {showLinks.includes("empdetails") && (
                        <Link to="/superadmin/empdetails" className="nav-link">
                            <div>
                              /
                            </div>
                           Details
                        </Link>
                    )}
                    {showLinks.includes("emppersonaldetails") && (
                        <Link to="/superadmin/emppersonaldetails" className="nav-link">
                            <div>
                              /
                            </div>
                          PersonalInformation
                        </Link>
                    )}
                    {showLinks.includes("documentss") && (
                        <Link to="/superadmin/documentsadmin" className="nav-link">
                            <div>
                              /
                            </div>
                            Documents
                        </Link>
                    )}
                     {showLinks.includes("assets") && (
                        <Link to="/superadmin/assets" className="nav-link">
                            <div>
                              /
                            </div>
                           Assets
                        </Link>
                    )}
                    {showLinks.includes("meetingpage") && (
                        <Link to="/superadmin/meetingRecordPage" className="nav-link">
                            <div>
                              /
                            </div>
                          MeetingPage
                        </Link>
                    )}
                    {showLinks.includes("emppayslip") && (
                        <Link to="/superadmin/employeepayslip" className="nav-link">
                            <div>
                               /
                            </div>
                            Payslips
                        </Link>
                    )}
                    {showLinks.includes("perks") && (
                        <Link to="/superadmin/perksadmin" className="nav-link">
                            <div>
                              /
                            </div>
                            perks
                        </Link>
                    )}
                    {showLinks.includes("expense") && (
                        <Link to="/superadmin/expenses" className="nav-link">
                            <div>
                              /
                            </div>
                            expenses
                        </Link>
                    )}
                     {showLinks.includes("timeoff") && (
                        <Link to="/superadmin/timeoff" className="nav-link">
                            <div>
                              /
                            </div>
                            timeoff
                        </Link>
                    )}
                    {showLinks.includes("policiessuperadmin") && (
                        <Link to="/superadmin/policiessuperadmin" className="nav-link">
                            <div>
                              /
                            </div>
                            Policies
                        </Link>
                    )}
                    {showLinks.includes("timesheet") && (
                        <Link to="/superadmin/timesheet" className="nav-link">
                            <div>
                              /
                            </div>
                            timesheet
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    );
};
export default Navbar;
