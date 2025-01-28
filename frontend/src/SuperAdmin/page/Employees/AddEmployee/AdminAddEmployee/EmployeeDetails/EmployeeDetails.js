import React, { useState } from "react";
import "./EmployeeDetails.css";
import IconMapper from "../../../../../../components/IconMapper/IconMapper";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import DynamicButton from "../../../../../../components/DynamicButton/DynamicButton";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../../../../components/SuperAdminNavbar/SuperAdminNavbar";


const EmployeeDetails = () => {
  const [employee, setEmployee] = useState({ firstName: "", lastName: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!employee.firstName && !employee.lastName) {
      newErrors.form = "Either first name or last name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted:", employee);
      navigate("/superadmin/emppersonaldetails", { state: employee });
    } else {
      toast("Please fill in the employee details");
    }
  };

  return (
    <>
            <Header siteName="Add Member" showLinks={["empdetails"]} />

    <div className="DetailsComponents">
      <div className="multi-header-emp-details">
        <p>Employee Details</p>
        <p>Employment Details</p>
        <p>Summary</p>
      </div>

      <div className="inp-details-form">
        <div className="AddNameEmployee">
          <DynamicButton
            text="Back"
            onClick={() => navigate("/superadmin/addemployee")}
            icon={ArrowBack}
            height="40px"
            width="200px"
            backgroundColor="#6674a9"
            color="#ffffff"
          />
          <div className="pt-2 pb-2">
            No employees added, please start entering your first employee below
            to get started.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-details">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="input-field">
                  <input
                    id={field}
                    name={field}
                    value={employee[field] || ""}
                    onChange={handleChange}
                    placeholder={
                      field === "firstName" ? "First Name" : "Last Name"
                    }
                    className={`input ${errors[field] ? "input-error" : ""}`}
                  />
                  {errors[field] && (
                    <p className="error-text">{errors[field]}</p>
                  )}
                </div>
              ))}
              <button type="submit" className="EmployeeSubmitButton">
                Submit
              </button>
            </div>
          </form>

          <div className="bulk-text-container">
            <div className="bulk-icon">
              <IconMapper iconName={"FileIcon"} className="import-icon" />
            </div>
            <div className="bulk-text">
              <p>
                Enter your employee details above to get started, or bulk import
                up to 1,000 employees at once.
              </p>
            </div>
            <div className="bulk-import-btn-container">
              <DynamicButton
                text="Bulk Import Employees"
                link="/superadmin/importbulkemp"
                height="40px"
                backgroundColor="#6674a9"
                color="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default EmployeeDetails;
