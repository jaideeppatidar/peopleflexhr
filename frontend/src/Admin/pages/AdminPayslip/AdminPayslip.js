import React from "react";
import "./AdminPayslip.css";

const PaySlip = () => {
  return (
    <div className="payslip-container">
      <div className="payslip-header">
        <img
          src="https://via.placeholder.com/150x50" // Replace with your logo URL
          alt="Company Logo"
          className="company-logo"
        />
        <h2>Company Name</h2>
        <h3>Pay Slip</h3>
      </div>

      <div className="payslip-details">
        <div className="details-row">
          <div>Employee Name:</div>
          <div>__________________</div>
        </div>
        <div className="details-row">
          <div>Designation:</div>
          <div>__________________</div>
        </div>
        <div className="details-row">
          <div>Department:</div>
          <div>__________________</div>
        </div>
        <div className="details-row">
          <div>Month:</div>
          <div>__________________</div>
        </div>
      </div>

      <table className="payslip-table">
        <thead>
          <tr>
            <th>Earnings</th>
            <th>Amount</th>
            <th>Deductions</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic</td>
            <td></td>
            <td>PF Employee</td>
            <td></td>
          </tr>
          <tr>
            <td>HRA</td>
            <td></td>
            <td>ESI Employee</td>
            <td></td>
          </tr>
          <tr>
            <td>Conv. All</td>
            <td></td>
            <td>Loan</td>
            <td></td>
          </tr>
          <tr>
            <td>Trans. All</td>
            <td></td>
            <td>Tax</td>
            <td></td>
          </tr>
          <tr>
            <td>CEA</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Medical Allowance</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><strong>SALARY (GROSS) / PM</strong></td>
            <td></td>
            <td>Total Deduction</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <div className="footer-section">
        <div>Prepared by</div>
        <div>Checked by</div>
        <div>Authorized by</div>
      </div>
    </div>
  );
};

export default PaySlip;
