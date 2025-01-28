import React, { useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import "./EmployeePersonalDetails.css";
import { AddEmployee } from "../../../../../../Utils/validation";
import { addEmployee } from "../../../../../ApiServices";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../../../../components/SuperAdminNavbar/SuperAdminNavbar";

const EmployeePersonalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { firstName, lastName, email } = location.state || {};
  // const fullName = `${ firstName || ""}` `${ lastName || ""}`.trim();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    firstName: firstName,
    lastName: lastName,
    middleName: "",
    employeeName: firstName,
    gender: "",
    password: "",
    mobile: "",
    designation: "",
    department: "",
    email: "",
    dob: "",
    role: "",
    education: "",
    employmentStartDate: "",
    probationStartDate: "",
    address: "",
    address1: "",
    address2: "",
    townCity: "",
    state: "",
    country: "",
    postcode: "",
    name: "",
    relation: "",
    contactNumber: "",
    nameOnAccount: "",
    nameOfBank: "",
    bankBranch: "",
    accountNumber: "",
    sortCodeOrIfscCode: "",
    taxCode: "",
    niNumber: "",
    passportNumber: "",
    passportcountryOfIssue: "",
    drivingcountryOfIssue: "",

    passportExpiryDate: "",
    licenseNumber: "",
    licenseClass: "",
    dateOfExpiry: "",
    visaNumber: "",
    visaExpiryDate: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submission Started");

    try {
      await AddEmployee.validate(formData, { abortEarly: false });
      setErrors({});
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title || "");
      formDataObj.append("firstName", formData.firstName || "");
      formDataObj.append("middleName", formData.middleName || "");
      formDataObj.append("lastName", formData.lastName || "");
      formDataObj.append(
        "employeeName",
        `${formData.firstName} ${formData.lastName}`
      );
      formDataObj.append("gender", formData.gender || "");
      formDataObj.append("password", formData.password || "");
      formDataObj.append("mobile", formData.mobile || "");
      formDataObj.append("role", formData.role || "");

      formDataObj.append("designation", formData.designation || "");
      formDataObj.append("department", formData.department || "");
      formDataObj.append("email", formData.email || "");
      formDataObj.append("dob", formData.dob || "");
      formDataObj.append("education", formData.education || "");
      formDataObj.append(
        "employmentStartDate",
        formData.employmentStartDate || ""
      );
      formDataObj.append(
        "probationStartDate",
        formData.probationStartDate || ""
      );
      formDataObj.append("address", formData.address || "");
      formDataObj.append("address1", formData.address1 || "");
      formDataObj.append("address2", formData.address2 || "");
      formDataObj.append("townCity", formData.townCity || "");
      formDataObj.append("state", formData.state || "");
      formDataObj.append("country", formData.country || "");
      formDataObj.append("postcode", formData.postcode || "");

      formDataObj.append("name", formData.name || "");
      formDataObj.append("relation", formData.relation || "");
      formDataObj.append("contactNumber", formData.contactNumber || "");

      formDataObj.append("nameOnAccount", formData.nameOnAccount || "");
      formDataObj.append("nameOfBank", formData.nameOfBank || "");
      formDataObj.append("bankBranch", formData.bankBranch || "");
      formDataObj.append("accountNumber", formData.accountNumber || "");
      formDataObj.append(
        "sortCodeOrIfscCode",
        formData.sortCodeOrIfscCode || ""
      );

      // Append sensitive details
      formDataObj.append("taxCode", formData.taxCode || "");
      formDataObj.append("niNumber", formData.niNumber || "");

      // Append passport details
      formDataObj.append("passportNumber", formData.passportNumber || "");
      formDataObj.append(
        "passportcountryOfIssue",
        formData.passportcountryOfIssue || ""
      );
      formDataObj.append(
        "passportExpiryDate",
        formData.passportExpiryDate || ""
      );
      formDataObj.append("licenseNumber", formData.licenseNumber || "");
      formDataObj.append(
        "drivingcountryOfIssue",
        formData.drivingcountryOfIssue || ""
      );
      formDataObj.append("licenseClass", formData.licenseClass || "");
      formDataObj.append("dateOfExpiry", formData.dateOfExpiry || "");

      formDataObj.append("visaNumber", formData.visaNumber || "");
      formDataObj.append("visaExpiryDate", formData.visaExpiryDate || "");
      formDataObj.append("image", formData.image || "");

      addEmployee(formDataObj);
      navigate("/superadmin/addemployee");
      toast.success("Employee added successfully");
      setFormData({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        employeeName: "",
        gender: "",
        password: "",
        mobile: "",
        designation: "",
        department: "",
        email: "",
        dob: "",
        role: "",
        education: "",
        employmentStartDate: "",
        probationStartDate: "",
        address: "",
        address1: "",
        address2: "",
        townCity: "",
        state: "",
        country: "",
        postCode: "",
        name: "",
        relation: "",
        contactNumber: "",
        nameOnAccount: "",
        nameOfBank: "",
        bankBranch: "",
        accountNumber: "",
        sortCodeOrIfscCode: "",
        taxCode: "",
        niNumber: "",
        passportNumber: "",
        passportcountryOfIssue: "",
        drivingcountryOfIssue: "",
        passportExpiryDate: "",
        licenseNumber: "",
        licenseClass: "",
        dateOfExpiry: "",
        visaNumber: "",
        visaExpiryDate: "",
        image: null,
      });
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const keys = name.split(".");

    if (e.target.type === "file" && files && files[0]) {
      // Handle file input
      setFormData({
        ...formData,
        [name]: files[0], // Save the selected file to the formData
      });
    } else if (keys.length === 1) {
      // Handle flat keys
      if (formData[keys[0]] !== value) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else if (keys.length === 2) {
      // Handle nested keys
      if (formData[keys[0]][keys[1]] !== value) {
        setFormData({
          ...formData,
          [keys[0]]: {
            ...formData[keys[0]],
            [keys[1]]: value,
          },
        });
      }
    } else if (keys.length === 3 && keys[0] === "emergencyContacts") {
      // Handle array of nested objects (e.g., emergency contacts)
      const index = parseInt(keys[1], 10);
      if (index >= 0 && index < formData.emergencyContacts.length) {
        const updatedContacts = formData.emergencyContacts.map((contact, i) =>
          i === index ? { ...contact, [keys[2]]: value } : contact
        );

        setFormData({
          ...formData,
          emergencyContacts: updatedContacts,
        });
      }
    }
  };

  return (
    <>
      <Header siteName={"Add Employee "} showLinks={["emppersonaldetails"]} />
      <div className="Employee-Container">
        <div className="multi-header-emp-details">
          <p>Employee Details</p>
          <p>Employment Details</p>
          <p>Summary</p>
        </div>
        <div className="layout-personal-container">
          <div className="left-personal-container">
            <div className="additional-left-container">
              <div className="header-personal-left">
                <div
                  className="back-arrow-section"
                  onClick={() => navigate("/superadmin/empdetails")}
                >
                  <IconButton>
                    <ArrowBack />
                  </IconButton>
                  <span className="arrow-label">Back</span>
                </div>
                <div className="personal-name-section">
                  <span
                    style={{ fontSize: "20px", fontWeight: "600" }}
                  >{`${firstName} ${lastName}`}</span>
                </div>
              </div>
              <Box display="flex" alignItems="center" spacing={1}>
                <Box flexGrow={1} marginRight={2}>
                  <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
                <Box width="200px">
                  {" "}
                  <TextField
                    select
                    label="Dropdown"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="firstName">First Name</MenuItem>
                    <MenuItem value="lastName">Last Name</MenuItem>
                  </TextField>
                </Box>
              </Box>

              <div className="personal-name-email-container">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  {/* Full Name Field */}
                  <Box flex={1} marginRight={2}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      value={firstName}
                      name="fullName"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  {/* Email Field */}
                  <Box flex={1}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={email || ""}
                      name="email"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                </Box>
              </div>
            </div>
          </div>

          <div className="personal-right-container">
            <div className="employee-details-form-container">
              <form onSubmit={handleSubmit} className="employee-details-form">
                <div className="employeeDetailsContiner">
                  <div className="BasicDetailsContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Basic Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Title</InputLabel>
                          <Select
                            name="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleChange}
                          >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                            <MenuItem value="Miss">Miss</MenuItem>
                            <MenuItem value="Dr">Dr</MenuItem>
                          </Select>
                          {/* {errors.title && (
                            <p className="error-message">{errors.title}</p>
                          )} */}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="firstName"
                          label="First Name"
                          value={firstName}
                          onChange={handleChange}
                          error={Boolean(errors.firstName)}
                          helperText={errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="lastName"
                          label="Last Name"
                          value={lastName}
                          onChange={handleChange}
                          error={Boolean(errors.lastName)}
                          helperText={errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="middleName"
                          label="Middle Name"
                          value={formData.middleName}
                          onChange={handleChange}
                          // error={Boolean(errors.middleName)}
                          // helperText={errors.middleName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="employeeName"
                          label="EmployeeName"
                          value={firstName}
                          onChange={handleChange}
                          error={Boolean(errors.employeeName)}
                          helperText={errors.employeeName}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            name="gender"
                            label="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                          {/* {errors.gender && (
                            <p className="error-message">{errors.gender}</p>
                          )} */}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="password"
                          name="password"
                          label="Password"
                          value={formData.password}
                          onChange={handleChange}
                          error={Boolean(errors.password)}
                          helperText={errors.password}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="mobile"
                          label="Mobile Number"
                          value={formData.mobile}
                          onChange={handleChange}
                          error={Boolean(errors.mobile)}
                          helperText={errors.mobile}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="designation"
                          label="Designation"
                          value={formData.designation}
                          onChange={handleChange}
                          error={Boolean(errors.designation)}
                          helperText={errors.designation}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          name="department"
                          label="Department"
                          value={formData.department}
                          onChange={handleChange}
                          error={Boolean(errors.department)}
                          helperText={errors.department}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          name="role"
                          label="Role"
                          value={formData.role}
                          onChange={handleChange}
                          error={Boolean(errors.role)}
                          helperText={errors.role}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          error={Boolean(errors.email)}
                          helperText={errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="dob"
                          label="Date Of Birth"
                          value={formData.dob}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          name="education"
                          label="Education"
                          value={formData.education}
                          onChange={handleChange}
                          error={Boolean(errors.education)}
                          helperText={errors.education}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="employmentStartDate"
                          label="EmploymentStartDate"
                          value={formData.employmentStartDate}
                          onChange={handleChange}
                          error={Boolean(errors.employmentStartDate)}
                          helperText={errors.employmentStartDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="probationStartDate"
                          label="ProbationStartDate"
                          value={formData.probationStartDate}
                          onChange={handleChange}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className="AddreshContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Address Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="address"
                          label="Address"
                          value={formData.address}
                          onChange={handleChange}
                          error={Boolean(errors.address)}
                          helperText={errors.address}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="address1"
                          label="Address1"
                          value={formData.address1}
                          onChange={handleChange}
                          error={Boolean(errors.address1)}
                          helperText={errors.address1}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="address2"
                          label="Address 2"
                          value={formData.address2}
                          onChange={handleChange}
                          error={Boolean(errors.address2)}
                          helperText={errors.address2}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="townCity"
                          label="Town/City"
                          value={formData.townCity}
                          onChange={handleChange}
                          error={Boolean(errors.townCity)}
                          helperText={errors.townCity}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="state"
                          label="State"
                          value={formData.state}
                          onChange={handleChange}
                          error={Boolean(errors.state)}
                          helperText={errors.state}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="country"
                          label="Country"
                          value={formData.country}
                          onChange={handleChange}
                          error={Boolean(errors.country)}
                          helperText={errors.country}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="postcode"
                          label="Postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          error={Boolean(errors.postcode)}
                          helperText={errors.postcode}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className="EmergencyContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Bank Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="nameOnAccount"
                          label="NameOnAccount"
                          value={formData.nameOnAccount}
                          onChange={handleChange}
                          error={Boolean(errors.nameOnAccount)}
                          helperText={errors.nameOnAccount}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="nameOfBank"
                          label="BankName"
                          value={formData.nameOfBank}
                          onChange={handleChange}
                          error={Boolean(errors.nameOfBank)}
                          helperText={errors.nameOfBank}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="bankBranch"
                          label="BranchName"
                          value={formData.bankBranch}
                          onChange={handleChange}
                          error={Boolean(errors.bankBranch)}
                          helperText={errors.bankBranch}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="accountNumber"
                          label="AccountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          error={Boolean(errors.accountNumber)}
                          helperText={errors.accountNumber}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="sortCodeOrIfscCode"
                          label="IFC Code"
                          value={formData.sortCodeOrIfscCode}
                          onChange={handleChange}
                          error={Boolean(errors.sortCodeorIfscCode)}
                          helperText={errors.sortCodeorIfscCode}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div className="SensitiveConainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Emergency Contact
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Name"
                          value={formData.name}
                          onChange={handleChange}
                          error={Boolean(errors.name)}
                          helperText={errors.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="relation"
                          label="Relation"
                          value={formData.relation}
                          onChange={handleChange}
                          error={Boolean(errors.relation)}
                          helperText={errors.relation}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="contactNumber"
                          label="ContactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          error={Boolean(errors.contactNumber)}
                          helperText={errors.contactNumber}
                        />
                      </Grid>
                    </Grid>
                  </div>

                  <div className="SensitiveConainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Sensitive Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="taxCode"
                          label="Tax Code"
                          value={formData.taxCode}
                          onChange={handleChange}
                          error={Boolean(errors.taxCode)}
                          helperText={errors.taxCode}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="niNumber"
                          label="NI Number"
                          value={formData.niNumber}
                          onChange={handleChange}
                          error={Boolean(errors.niNumber)}
                          helperText={errors.niNumber}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div className="PassportContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Passport
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="passportNumber"
                          label="Passport Number"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          error={Boolean(errors.passportNumber)}
                          helperText={errors.passportNumber}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="passportcountryOfIssue"
                          label="PassportcountryOfIssue"
                          value={formData.passportcountryOfIssue}
                          onChange={handleChange}
                          error={Boolean(errors.passportcountryOfIssue)}
                          helperText={errors.passportcountryOfIssue}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="passportExpiryDate"
                          label="Passport Expiry Date"
                          value={formData.passportExpiryDate}
                          onChange={handleChange}
                          error={Boolean(errors.passportExpiryDate)}
                          helperText={errors.passportExpiryDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div className="DrivingContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Driving Licence
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="licenseNumber"
                          label="LicenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          error={Boolean(errors.licenseNumber)}
                          helperText={errors.licenseNumber}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="text"
                          name="drivingcountryOfIssue"
                          label="DrivingcountryOfIssue"
                          value={formData.drivingcountryOfIssue}
                          onChange={handleChange}
                          error={Boolean(errors.drivingcountryOfIssue)}
                          helperText={errors.drivingcountryOfIssue}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="licenseClass"
                          label="LicenseClass"
                          value={formData.licenseClass}
                          onChange={handleChange}
                          error={Boolean(errors.licenseClass)}
                          helperText={errors.licenseClass}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="dateOfExpiry"
                          label="DateOfExpiry"
                          value={formData.dateOfExpiry}
                          onChange={handleChange}
                          error={Boolean(errors.dateOfExpiry)}
                          helperText={errors.dateOfExpiry}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div className="VisaContainer">
                    <Typography
                      style={{ fontSize: "1.25rem", fontWeight: "600" }}
                      className="form-details-title"
                    >
                      Visa
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          name="visaNumber"
                          label="Visa Number"
                          value={formData.visaNumber}
                          error={Boolean(errors.visaNumber)}
                          helperText={errors.visaNumber}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          name="visaExpiryDate"
                          label="VisaExpiryDate"
                          value={formData.visaExpiryDate}
                          onChange={handleChange}
                          error={Boolean(errors.visaExpiryDate)}
                          helperText={errors.visaExpiryDate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <input
                        accept="image/*"
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        style={{ marginTop: "16px" }}
                      />
                    </Grid>
                  </div>
                  <div className="save-and-continue-footer">
                    <div className="personal-button-container">
                      <button
                        onClick={handleSubmit}
                        className="save-and-continue-btn"
                      >
                        Save & Continue
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default EmployeePersonalDetails;
