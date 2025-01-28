import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Box,
} from "@mui/material";
import { AddDocumentValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import { DocumentUpload } from "../../EmpApiServices";
import { useSelector } from "react-redux";
import "./AddDocumentPopup.css";

const AddDocumentPopup = ({ open, onClose, loadDialogues }) => {
  const { employeeName, employeeId } = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    documentName: "",
    uploadDate: "",
    image: null,
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);

  // Reset form data and errors every time the dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        employeeName: employeeName,
        employeeId: employeeId,
        documentName: "",
        uploadDate: "",
        image: null,
        status: "Pending",
      });
      setErrors({});
    }
  }, [open, employeeName, employeeId]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (!file) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "No file dropped.",
      }));
      return;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    setDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddDocumentValidation.validate(formData, { abortEarly: false });
      setErrors({});

      // Prepare form data for submission
      const formDataToSend = new FormData();
      formDataToSend.append("employeeName", formData.employeeName);
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("documentName", formData.documentName);
      formDataToSend.append("uploadDate", formData.uploadDate);
      formDataToSend.append("status", formData.status);

      // Validate file exists before appending
      if (!formData.image) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Document file is required.",
        }));
        toast.error("Please upload a document.");
        return;
      }
      formDataToSend.append("image", formData.image);

      await DocumentUpload(formDataToSend);
      toast.success("Document uploaded successfully.");

      // Reset form data after submission
      setFormData({
        employeeName: employeeName,
        employeeId: employeeId,
        documentName: "",
        uploadDate: "",
        image: null,
        status: "Pending",
      });

      // Reload dialogues and close dialog after a delay
      setTimeout(async () => {
        onClose();
        await loadDialogues(employeeId);
      }, 3000);
    } catch (err) {
      console.error("Submission Error:", err);

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
        toast.error("Please fill in the required fields correctly.");
      } else {
        toast.error("An unexpected error occurred during document upload");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: "dialog" }}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
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
              disabled
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
              disabled
            />
          </Box>
          <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
            <FormControl fullWidth margin="dense" error={Boolean(errors.documentName)}>
              <InputLabel>Document Type</InputLabel>
              <Select
                id="documentName"
                name="documentName"
                value={formData.documentName}
                onChange={handleChange}
                label="Document Type"
              >
                <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                <MenuItem value="Pan Card">Pan Card</MenuItem>
                <MenuItem value="Address Proof">Address Proof</MenuItem>
                <MenuItem value="ID Proof">ID Proof</MenuItem>
              </Select>
              {errors.documentName && (
                <div style={{ color: "red" }}>{errors.documentName}</div>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="dense"
              id="uploadDate"
              name="uploadDate"
              label="Upload Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.uploadDate}
              onChange={handleChange}
              error={Boolean(errors.uploadDate)}
              helperText={errors.uploadDate}
            />
          </Box>
          <div
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="icon-wrapper">
              <IconMapper style={{ width: "15%" }} iconName={"UploadFile"} />
            </div>
            <p>Drag and drop Files Here to Upload</p>
            <label htmlFor="file-upload" className="uploadfilebutton">
              Upload File
              <input
                id="file-upload"
                type="file"
                name="image"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div>
            Choose up to 100 documents you'd like to upload. There is a limit of
            30MB per file.
          </div>
          {errors.image && <div style={{ color: "red" }}>{errors.image}</div>}

          <div className="form-button-employee">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button-document"
            >
              Cancel
            </button>
            <button type="submit" className="save-button-document">
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
