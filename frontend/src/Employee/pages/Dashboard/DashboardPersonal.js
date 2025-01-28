import React, { useEffect, useState } from "react";
import "./DashboardPersonal.css";
import { useDispatch, useSelector } from "react-redux";
import { editEmployeeData, fetchEmployeeData } from "../../EmpApiServices";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { updateUserImage } from "../../Redux/authSlice/authSlice";
const DashboardPersonal = () => {
  const dispatch = useDispatch();
  const { employeeId } = useSelector((state) => state.auth.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    middleName: "",
    employeeName: "",
    gender: "",
    password: "",
    mobile: "",
    designation: "",
    department: "",
    email: "",
    dob: "",
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
    passportExpiryDate: "",
    licenseNumber: "",
    drivingcountryOfIssue: "",
    licenseClass: "",
    dateOfExpiry: "",
    visaNumber: "",
    visaExpiryDate: "",
    image: null,
  });

 
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetchEmployeeData(employeeId);
        setFormData(response);
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      }
    };
    fetchEmployeeDetails();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, files, type } = e.target;

    if (type === "file" && files?.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload only image files.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size should not exceed 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSubmit = new FormData();
        if (formData.image) {
        formDataToSubmit.append("image", formData.image);
      }
        Object.keys(formData).forEach((key) => {
        if (key !== "image" && key !== "imagePreview" && formData[key]) {
          formDataToSubmit.append(key, formData[key]);
        }
      });
        const response = await editEmployeeData(employeeId, formDataToSubmit);
        if (response?.message?.toLowerCase().includes("success")) {
          dispatch(updateUserImage(response.user.image));
        setSuccessMessage("Profile updated successfully");
        setErrorMessage(null);
      } else {
        throw new Error(response?.message || "Failed to update details");
      }
    } catch (error) {
      console.error("Error updating details:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Error updating details"
      );
      setSuccessMessage(null);
    }
  };
  
  

  return (
    <div className="dashboard-personal-form-container">
      <form className="dashboard-personal-form">
        <div className="EmolpyeePersonalDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Employee Details
          </h2>
          <div className="personal-details-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jobTitle">Designation</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.designation || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Employee Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="employmentStartDate"
                  value={formData.employmentStartDate || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="probationStartDate">Probation Start Date</label>
                <input
                  type="date"
                  id="probationStartDate"
                  name="probationStartDate"
                  value={formData.probationStartDate || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeeAddreshDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Address Details
          </h2>
          <div className="address-form">
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address1">Address 1</label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1 || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address2">Address 2</label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2 || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="townCity">Town/City</label>
                <input
                  type="text"
                  id="townCity"
                  name="townCity"
                  value={formData.townCity || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="postCode">Postcode</label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Emergency Contact
          </h2>
          <div className="dashboard-personal-emergency-container">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="relation">Relation</label>
                <input
                  type="text"
                  id="relation"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeeBankDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Bank Details
          </h2>
          <div className="bank-details-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nameOnAccount">Name on Account</label>
                <input
                  type="text"
                  id="nameOnAccount"
                  name="nameOnAccount"
                  value={formData.nameOnAccount || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nameOfBank">Name of Bank</label>
                <input
                  type="text"
                  id="nameOfBank"
                  name="nameOfBank"
                  value={formData.nameOfBank || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bankBranch">Bank Branch</label>
                <input
                  type="text"
                  id="bankBranch"
                  name="bankBranch"
                  value={formData.bankBranch || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="accountNumber">Account Number</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sortCodeOrIfscCode">Sort Code</label>
                <input
                  type="text"
                  id="sortCodeOrIfscCode"
                  name="sortCodeOrIfscCode"
                  value={formData.sortCodeOrIfscCode || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeeSensitiveDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Sensitive Details
          </h2>
          <div className="sensitive-details-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="taxCode">Tax Code</label>
                <input
                  type="text"
                  id="taxCode"
                  name="taxCode"
                  value={formData.taxCode || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="niNumber">NI Number</label>
                <input
                  type="text"
                  id="niNumber"
                  name="niNumber"
                  value={formData.niNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeePassportDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="dashboard-personal-form-title"
          >
            Passport
          </h2>
          <div className="passport-details-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="passportNumber">Passport Number</label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="passportcountryOfIssue">Country of Issue</label>
                <input
                  type="text"
                  id="passportcountryOfIssue"
                  name="passportcountryOfIssue"
                  value={formData.passportcountryOfIssue || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="passportExpiryDate">Date of Expiry</label>
                <input
                  type="date"
                  id="passportExpiryDate"
                  name="passportExpiryDate"
                  value={formData.passportExpiryDate || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeeDrivingDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="form-details-title"
          >
            Driving Licence
          </h2>
          <div className="driving-licence-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licenseNumber">Licence Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="drivingcountryOfIssue">Country of Issue</label>
                <input
                  type="text"
                  id="drivingcountryOfIssue"
                  name="drivingcountryOfIssue"
                  value={formData.drivingcountryOfIssue || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="licenseClass">Licence Class</label>
                <input
                  type="text"
                  id="licenseClass"
                  name="licenseClass"
                  value={formData.licenseClass || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfExpiry">Date of Expiry</label>
                <input
                  type="date"
                  id="dateOfExpiry"
                  name="dateOfExpiry"
                  value={formData.dateOfExpiry || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="EmployeeVisaDetails">
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "600" }}
            className="form-details-title"
          >
            Visa
          </h2>
          <div className="visa-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="visaNumber">Visa Number</label>
                <input
                  type="text"
                  id="visaNumber"
                  name="visaNumber"
                  value={formData.visaNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="visaExpiryDate">Visa Expiry Date</label>
                <input
                  type="date"
                  id="visaExpiryDate"
                  name="visaExpiryDate"
                  value={formData.visaExpiryDate || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <ToastContainer />
          </div>
        </div>
        <div className="EmployeeVisaDetails">
          <div>
            <h2 className="UploadProfilePersonal"> Upload Profile </h2>
            <br />
            <input
              type="file"
             id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="EditInputField"
            />
            {formData.imagePreview && (
    <div>
      <img
        src={formData.imagePreview}
        alt="Profile Preview"
        style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
      />
    </div>
  )}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
        </div>

        <div className="flex justify-start">
          <Link to="/profile" 
            className="EditButtonAllField bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-40"
            type="submit"
            onClick={handleSubmit}
          >
            Save
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DashboardPersonal;
