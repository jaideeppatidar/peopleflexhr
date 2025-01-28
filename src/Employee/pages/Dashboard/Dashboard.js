import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import IconMapper from "../../../components/IconMapper/IconMapper";
import ChatBox from "../../../components/ChatBox/Chatbox";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import { useSelector } from "react-redux";
import { fetchEmployeeById } from "../../EmpApiServices";
import './Dashboard.css'
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

  return (
    <Box className="employeedashboard">
      <div>
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <>
            {filteredDocuments.map((employee, index) => (
              <Box key={index} className="employeedashboard-header">
                <Box className="left-side">
                  <div className="profile-image-containerd">
                    {employee.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_IMAGE}/${employee.image}?${new Date().getTime()}`}
                        alt={employee.employeeName}
                        className="empprofile-img"
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
                  <Box ml={2} className="text-white">
                    <Typography className="DashboardEmployeeName">
                      {employee.employeeName}
                    </Typography>
                    <Typography className="DashboardEmployeeName">
                      {employee.designation}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <div className="header-logo">
                    <IconMapper iconName={"WhiteLogo"} />
                  </div>
                  <Box className="flex items-center gap-2 text-white">
                    <div className="linkedin-icon">
                      <IconMapper iconName={"linkedin"} isFontAwesome={true} />
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                          <IconMapper iconName={"plus"} isFontAwesome={true} />
                        }
                        className="follow-button"
                      >
                        Follow
                      </Button>
                    </div>
                  </Box>
                </Box>

                <Box className="announcement mt-4 text-white">
                  <Typography variant="body1" className="parygrap-dasboard">
                    {employee.announcement || 
                      "I'm pleased to announce that the payslips for January 2024 are now ready and available for your review. You can view your payslip by logging into our payroll system. As always, we are committed to ensuring timely and accurate salary payments. If you have any questions or encounter any issues accessing your payslip, please do not hesitate to contact the HR department."}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Box>
              <ChatBox />
            </Box>
          </>
        )}
      </div>
    </Box>
  );
};

export default Dashboard;