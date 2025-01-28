import React, { useState } from "react";
import "./EmpAddSuccessfully.css";
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const employees = [
  { id: 1, name: "Siddharth Patidar" },
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" },
];

const EmpAddSuccessfully = () => {
  const [selectedEmployees, setSelectedEmployees] = useState(
    employees.map((emp) => emp.id)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(employees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((empId) => empId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    navigate("/admin/addemployee");
  };

  return (
    <div className="emp-add-success-wrapper">
      <div className="emp-add-success-container">
        <p className="success-heading">
          Success! You have 1 new employee in HireFlex
        </p>
        <div className="heading-section">
          <p className="email-notification">
            Why not also send them a registration email? Select from below...
          </p>
        </div>

        <div className="search-select-section">
          <TextField
            label="Search..."
            variant="outlined"
            // fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <div className="select-deselect-box">
            <Checkbox
              checked={selectedEmployees.length === employees.length}
              onChange={handleSelectAll}
            />
            <span>Select/Deselect All</span>
          </div>
        </div>

        <div className="employee-list-section">
          <List>
            {filteredEmployees.map((employee) => (
              <ListItem key={employee.id} button>
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                />
                <ListItemText primary={employee.name} />
              </ListItem>
            ))}
          </List>
        </div>

        <div className="action-button-section">
          {/* <button  className="close-emp-btn">Close</button> */}
          <button
            className="skip-button-emp"
            onClick={() => navigate("/admin/addemployee")}
          >
            Skip
          </button>
          <button
            className="save-button-emp"
            onClick={() => navigate("/admin/addemployee")}
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpAddSuccessfully;
