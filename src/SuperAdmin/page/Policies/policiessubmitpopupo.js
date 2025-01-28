import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { PloiciesSuperValidation } from "../../../Utils/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IconMapper from "../../../components/IconMapper/IconMapper";
import "./policiessubmitpopupo.css";
import { policies } from "../../ApiServices";

const AddDocumentPopup = ({ open, onClose, fetchPolicies }) => {
  const [formData, setFormData] = useState({
    policyName: "",
    uploadDate: "",
    current: "",
    file: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      const selectedFile = files[0];
      
      if (!selectedFile) {
        return;
      }

      if (selectedFile.type !== "application/pdf") {
        toast.error("Only PDF files are allowed!");
        setErrors({ ...errors, file: "Only PDF files are allowed" });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 5MB!");
        setErrors({ ...errors, file: "File size must be less than 5MB" });
        return;
      }

      // Store the actual File object, not just its properties
      setFormData({ ...formData, file: selectedFile });
      setSelectedFileName(selectedFile.name);
      setErrors({ ...errors, file: null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      setErrors({ ...errors, file: "Please select a file" });
      toast.error("Please select a file");
      return;
    }

    try {
      await PloiciesSuperValidation.validate(formData, { abortEarly: false });
      setErrors({});

      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.file); 

      formDataToSend.append('policyName', formData.policyName);
      formDataToSend.append('uploadDate', formData.uploadDate);
      formDataToSend.append('current', formData.current);  
      formDataToSend.append('description', formData.description);
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

        await policies(formDataToSend);  
        toast.success("Policies uploaded successfully");
        setTimeout(async () => {
          onClose();
          await fetchPolicies();  // Ensure this is a valid function
        }, 3000);
      
    } catch (err) {
      console.error("Error:", err);
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in all required fields correctly");
      } else {
        toast.error(err.message || "An unexpected error occurred during upload");
      }
    }
};


  // Rest of the component remains the same...
  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: "dialog" }}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ padding: "10px" }}>
          <Typography variant="h6" align="center">
            Add New Policies
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                id="policyName"
                name="policyName"
                label="Policies Name"
                value={formData.policyName}
                onChange={handleChange}
                error={Boolean(errors.policyName)}
                helperText={errors.policyName}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Current</InputLabel>
                <Select
                  id="current"
                  name="current"
                  label="Current"
                  value={formData.current}
                  onChange={handleChange}
                  error={Boolean(errors.current)}
                >
                  <MenuItem value="True">True</MenuItem>
                  <MenuItem value="False">False</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="dropzone">
                <div className="icon-wrapper">
                  <IconMapper icon="upload" className="upload-icon" />
                </div>
                <Typography variant="body2" color="textSecondary">
                  {selectedFileName || "Drag and drop a PDF file or click to select"}
                </Typography>
                {errors.file && (
                  <Typography color="error" variant="caption">
                    {errors.file}
                  </Typography>
                )}
                <Button
                  className="uploadfilebutton"
                  component="label"
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Upload PDF
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    hidden
                  />
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <div className="form-button-employee">
            <Button
              onClick={onClose}
              className="cancel-button-employee"
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="save-button-employee"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>
        </DialogActions>
        <ToastContainer />
      </form>
    </Dialog>
  );
};

export default AddDocumentPopup;