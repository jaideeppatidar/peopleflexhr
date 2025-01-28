import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { AddExpensesValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ExpensePopup.css";
import { useSelector } from "react-redux";
import { submitExpenseRequest } from "../../EmpApiServices";
import IconMapper from "../../../components/IconMapper/IconMapper";

const AddDocumentPopup = ({ open, onClose, loadExpenses }) => {
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    employeeName: employeeName,
    employeeId: employeeId,
    expenseDate: "",
    expenseDescription: "",
    expenseType: "",
    amount: "",
    receiptFileName: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the file object
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddExpensesValidation.validate(formData, { abortEarly: false });
      setErrors({});

      const formDataToSend = new FormData();
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("expenseDate", formData.expenseDate);
      formDataToSend.append("expenseDescription", formData.expenseDescription);
      formDataToSend.append("expenseType", formData.expenseType);
      formDataToSend.append("amount", formData.amount);
      if (formData.receiptFileName) {
        formDataToSend.append("receiptFileName", formData.receiptFileName);
      }
      formDataToSend.append("status", formData.status);

      await submitExpenseRequest(formDataToSend);

      setFormData({
        employeeName: employeeName,
        employeeId: employeeId,
        expenseDate: "",
        expenseDescription: "",
        expenseType: "",
        amount: "",
        receiptFileName: "",
        status: "Pending",
      });

      setTimeout(async () => {
        onClose();
        await loadExpenses(employeeId);
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        const errorMessage =
          err.response.data.error || "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in the required fields.");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <TextField
              fullWidth
              margin="dense"
              id="employeeName"
              name="employeeName"
              label="Employee Name"
              value={formData.employeeName}
              onChange={handleChange}
              error={Boolean(errors.employeeName)}
              helperText={errors.employeeName}
            />

            <TextField
              fullWidth
              margin="dense"
              id="employeeId"
              name="employeeId"
              label="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              error={Boolean(errors.employeeId)}
              helperText={errors.employeeId}
            />
          </Box>
          <Box
            display="flex"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <TextField
              fullWidth
              margin="dense"
              id="expenseDate"
              name="expenseDate"
              label="Expense Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.expenseDate}
              onChange={handleChange}
              error={Boolean(errors.expenseDate)}
              helperText={errors.expenseDate}
            />

            <TextField
              fullWidth
              margin="dense"
              id="expenseDescription"
              name="expenseDescription"
              label="Expense Description"
              value={formData.expenseDescription}
              onChange={handleChange}
              error={Boolean(errors.expenseDescription)}
              helperText={errors.expenseDescription}
            />
          </Box>
          <Box
            display="flex"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <TextField
              fullWidth
              margin="dense"
              id="expenseType"
              name="expenseType"
              label="Expense Type"
              value={formData.expenseType}
              onChange={handleChange}
              error={Boolean(errors.expenseType)}
              helperText={errors.expenseType}
            />

            <TextField
              fullWidth
              margin="dense"
              id="amount"
              name="amount"
              label="Amount"
              value={formData.amount}
              onChange={handleChange}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
            />
          </Box>


          <div className="dropzone">
            <div className="icon-wrapper">
              <IconMapper
                style={{ width: "15%" }}
                className="uploadfilecolor"
                iconName={"UploadFile"}
              />
            </div>
            <p> Image Here to Upload</p>
            <label htmlFor="receiptFileName" className="uploadfilebutton">
              Upload Image
              <input
                id="receiptFileName"
                type="file"
                name="receiptFileName"
                onChange={handleChange}
              />
            </label>
          </div>
          {formData.receiptFileName && (
            <div style={{ marginTop: "10px", fontSize: "0.9em" }}>
              File: {formData.receiptFileName.name}
            </div>
          )}

          <div className="form-button-expense">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-expense"
            >
              Cancel
            </button>
            <button type="submit" className="save-button-expense">
              Save
            </button>
          </div>
        </DialogContent>

        <ToastContainer />
      </form>
    </Dialog>
  );
};

export default AddDocumentPopup;
