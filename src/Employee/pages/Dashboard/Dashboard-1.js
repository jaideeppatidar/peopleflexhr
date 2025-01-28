import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchEmployeeById } from "../../EmpApiServices";
import "./Dashboard-1.css";
import Header from "../../components/Navbar/Navbar";
import CommonHeader from "../../../components/CommonHeader";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";

const Dashboard = () => {
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { employeeId } = useSelector((state) => state.auth.user);

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

  const handleRefreshClick = () => {
    fetchEmployeeData(employeeId);
  };

  return (
    <>
      <Header siteName={"Account"} showLinks={["account"]} />
      <div className="dashboard-container">
        <CommonHeader
          showIcons={{ plus: false, trash: false, rotate: true }}
          showSearchFilter={false}
          handleRefreshClick={handleRefreshClick}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="dashboard-grid">
            {filteredDocuments.map((teamMember) => (
              <div
                key={teamMember.id || teamMember._id}
                className="dashboard-card"
              >
                <div className="card-content">
                  <div className="profile-info">
                    <div className="profile-image-container">
                      <img
                        src={`${process.env.REACT_APP_API_IMAGE}/${teamMember.image}`} // Use employee's profile image or default image
                        alt="Profile"
                        className="profile-image"
                      />
                    </div>
                    <div className="employee-Infromation">
                      <h3 className="employee-name">
                        {teamMember.employeeName}
                      </h3>
                      <div className="action-buttons">
                        <Link
                          to={`/employee/dashboardpersonal/${
                            teamMember.id || teamMember._id
                          }`}
                          className="view-details-link"
                        >
                          View full details
                        </Link>
                      </div>
                    </div>




                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
