import React, { useState } from "react";
import "./EmpSummary.css";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import DynamicButton from "../../../../../../components/DynamicButton/DynamicButton";
const EmpSummary = () => {
    const [selectedEmpSummary, setSelectedEmpSummary] = useState([]);
    const [currentItems] = useState([
        { id: 1, name: "John Doe", email: "johndoe@example.com" },
    ]); // Fill with actual data
    const navigate = useNavigate();

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedEmpSummary(currentItems.map((item) => item.id));
        } else {
            setSelectedEmpSummary([]);
        }
    };
    const handleSelectEmpSummary = (id) => {
        setSelectedEmpSummary((prev) =>
            prev.includes(id)
                ? prev.filter((payslipId) => payslipId !== id)
                : [...prev, id]
        );
    };

    return (
        <>
        <div className="SummaryContainner">
            <div className="multi-header-employee-summary">
                <p>Employee Details</p>
                <p>Employment Details</p>
                <p>Summary</p>
            </div>
            <DynamicButton
                text="Back"
                onClick={() => navigate("/superadmin/singledetails")}
                icon={ArrowBack}
                height="40px"
                width="100px"
                backgroundColor="#6674a9"
                color="#ffffff"
            />
            <div className="summary-tablebody">
                <table className="summary-table-data">
                    <thead>
                        <tr>
                            <th style={{ padding: "5px" }}>
                                <Checkbox
                                    checked={
                                        selectedEmpSummary.length === currentItems.length &&
                                        currentItems.length > 0
                                    }
                                    indeterminate={
                                        selectedEmpSummary.length > 0 &&
                                        selectedEmpSummary.length < currentItems.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Name</th>
                            <th style={{ paddingLeft: "20%" }}>Email address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((EmpSummary) => (
                            <tr key={EmpSummary.id}>
                                <td
                                    className="w-[10px]"
                                    style={{ padding: "5px", textAlign: "left" }}
                                >
                                    <Checkbox
                                        checked={selectedEmpSummary.includes(EmpSummary.id)}
                                        onChange={() => handleSelectEmpSummary(EmpSummary.id)}
                                    />
                                </td>
                                <td data-label="Name">{EmpSummary.name}</td>
                                <td style={{ paddingLeft: "20%" }} data-label="Email address">
                                    {EmpSummary.email}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
           
                <div className="SummaryButtonContainer">
                    <div>
                    <button className="StartButton" onClick={() => navigate('/superadmin/empdetails')}>Start Over</button>
                    </div>

                    <div className="ButtonAllContainer">
                    <button className="BackButton" onClick={() => navigate('/superadmin/singledetails')}>Back</button>
                    <button className="AddSummaryButton" onClick={() => navigate('/superadmin/finalsummary')}>Add all to HireFlex</button>
                    </div>
                   
                </div>
                </div>
        </>
    );
};

export default EmpSummary;
