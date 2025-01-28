import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddPerksValidations } from "../../../../Utils/validation";
import "./uploadPerks.css";
import IconMapper from "../../../../components/IconMapper/IconMapper";
import { addPerk } from "../../../ApiServices";

const UploadPopup = ({ isOpen, onClose, fetchData }) => {
  const [formdata, setFormData] = useState({
    image: null,
    perksName: "",
    category: "",
    description: "",
    url: "",
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files && files.length > 0 ? files[0] : value, // Ensure file is correctly added
    }));
  };
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form data using AddPerksValidations
      await AddPerksValidations.validate(formdata, { abortEarly: false });
      setErrors({}); // Clear existing errors if validation passes
  
      const formDataToSend = new FormData();
            if (formdata.image) {
        formDataToSend.append("image", formdata.image);
      } else {
        console.error("No image selected");
      }
  
      // Append other fields to formData
      formDataToSend.append("perksName", formdata.perksName);
      formDataToSend.append("description", formdata.description);
      formDataToSend.append("url", formdata.url);
      formDataToSend.append("category", formdata.category);
  
      // Call your API to add the perks
      await addPerk(formDataToSend);
  
      toast.success("Perks added successfully");
      setTimeout(async () => {
        setFormData({
          image: null,
          perksName: "",
          category: "",
          description: "",
          url: "",
        });
        onClose(); // Close the dialog
        await fetchData(); // Refresh the data
      }, 3000);
  
    } catch (err) {
      // Handle validation errors
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
        toast.error("Please fill in the following");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Perks</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <div className="upload-popup-content">
            <TextField
              label="perksName"
              variant="outlined"
              fullWidth
              name="perksName"
              value={formdata.perksName}
              onChange={handleChange}
              error={!!errors.perksName}
              helperText={errors.perksName}
              margin="normal"
            />
            <TextField
              label="Url"
              variant="outlined"
              fullWidth
              multiline
              name="url"
              value={formdata.url}
              onChange={handleChange}
              error={!!errors.url}
              helperText={errors.url}
              margin="normal"
            />

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>category</InputLabel>
              <Select
                label="category" // Associate the label with the Select
                name="category"
                value={formdata.category}
                onChange={handleChange}
                error={!!errors.category}
              >
                <MenuItem value="Internal">Internal</MenuItem>
                <MenuItem value="External">External</MenuItem>
              </Select>
              {errors.category && (
                <Typography color="error">{errors.category}</Typography>
              )}
            </FormControl>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              name="description"
              value={formdata.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />
            <div className="dropzone">
              <div className="icon-wrapper">
                <IconMapper
                  style={{ width: "15%" }}
                  className="uploadfilecolor"
                  iconName={"UploadFile"}
                />
              </div>
              <p> Image Here to Upload</p>
              <label htmlFor="upload-button-file" className="uploadfilebutton">
                Upload Image
                <input
                  id="upload-button-file"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
            </div>
            {errors.image && (
              <Typography color="error">{errors.image}</Typography>
            )}
          </div>
          <DialogActions>
            <div className="form-button-employee">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button-employee"
              >
                Cancel
              </button>
              <button type="submit" className="save-button-employee">
                Save
              </button>
            </div>
          </DialogActions>
        </form>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
};

export default UploadPopup;
