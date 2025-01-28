import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Box,
} from "@mui/material";
import { LeaveRequestValidationTimeOff } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TimeoffPup.css";
import { useSelector } from "react-redux";

import { submitLeaveRequest } from "../../EmpApiServices";

const TimeOffRequest = ({ open, onClose, fetchLeavePeriods }) => {
  const { employeeId } = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    endDate: "",
    partialDays: "",
    reason: "",
    startDate: "",
    type: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LeaveRequestValidationTimeOff.validate(formData, {
        abortEarly: false,
      });
      setErrors({});
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("endDate", formData.endDate);
      formDataToSend.append("partialDays", formData.partialDays);
      formDataToSend.append("reason", formData.reason);
      formDataToSend.append("startDate", formData.startDate);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("employeeId", employeeId);
      console.log(formDataToSend);
      await submitLeaveRequest(formDataToSend);
      setTimeout(async () => {
        setIsLoading(false);
        setFormData({
          endDate: "",
          partialDays: "",
          reason: "",
          startDate: "",
          type: "",
          status: "Pending",
        });
        onClose();
        await fetchLeavePeriods();
      }, 3000);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in the required fields.");
      } else {
        console.error("Error submitting leave request:", err);
        toast.error("An unexpected error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
    <div>
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <div className="timeoff-Container">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{"New Leave Request"}</DialogTitle>
          <DialogContent>
            <Box
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              {/* <label>Start Date</label> */}
              <TextField
                fullWidth
                margin="dense"
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={Boolean(errors.startDate)}
                helperText={errors.startDate}
                style={{ width: '250px' }}
              />
              {/* <label>End Date</label> */}
              <TextField
                fullWidth
                margin="dense"
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={Boolean(errors.endDate)}
                helperText={errors.endDate}
                style={{ width: '250px' }}
              />
            </Box>

            <Box
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              {/* <label>Partial Days</label> */}
              <FormControl fullWidth margin="dense">
                <Select
                  id="partialDays"
                  name="partialDays"
                  value={formData.partialDays}
                  onChange={handleChange}
                  error={Boolean(errors.partialDays)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="halfday">Half Day</MenuItem>
                  <MenuItem value="fullday">Full Day</MenuItem>
                </Select>
                {errors.partialDays && (
                  <p className="error-message">{errors.partialDays}</p>
                )}
              </FormControl>
              {/* <label>Type</label> */}
              <FormControl fullWidth margin="dense">
                <Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  error={Boolean(errors.type)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="sick">Sick</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                </Select>
                {errors.type && <p className="error-message">{errors.type}</p>}
              </FormControl>
            </Box>
            {/* <label>Reason</label> */}
            <TextField
              fullWidth
              margin="dense"
              id="reason"
              name="reason"
              label="Reason"
              value={formData.reason}
              onChange={handleChange}
              error={Boolean(errors.reason)}
              helperText={errors.reason}
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <div className="form-button-employee">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button-timeoff"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button-timeoff"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Save"}
              </button>
            </div>
          </DialogActions>
          <ToastContainer />
        </form>
      </div>
    </Dialog>
    </div>
    </>
  );
};

export default TimeOffRequest;
