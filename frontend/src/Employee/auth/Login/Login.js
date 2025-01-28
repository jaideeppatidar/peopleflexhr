import React, { useState } from "react";
import "./Login.css";
import loginpage from "../../../components/assets/Icons/loginpage.png";
import companyLogo from "../../../components/assets/Icons/hirefleX247.com-dark.png";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Adminloginvalidation,
  SuperAdminloginvalidation,
} from "../../../Utils/validation";
import { loginvalidation } from "../../../Utils/validation";
import "react-toastify/dist/ReactToastify.css";
import { loginSuperAdmin } from "../../../SuperAdmin/ApiServices";
import { loginEmployee } from "../../EmpApiServices";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice/authSlice";
import { TextField, Link } from "@mui/material";
import { loginAdmin } from "../../../Admin/APIServices";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("Employee");
  const [apiError, setApiError] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setApiError("");
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedUserType === "Super Admin") {
        await SuperAdminloginvalidation.validate(
          { email, password },
          { abortEarly: false }
        );
        const data = await loginSuperAdmin({ email, password });
        if (data.jwtToken) {
          localStorage.setItem("jwtToken", data.jwtToken);
          setSuccess("Super Admin Login Success");
          setTimeout(() => {
            navigate("/superadmin/dashboard");
          }, 2000);
        }
      } else if (selectedUserType === "Employee") {
        await loginvalidation.validate(
          { employeeId, password },
          { abortEarly: false }
        );
        const data = await loginEmployee(employeeId, password);
        const { token, user } = data;
        localStorage.setItem("token", token);
        dispatch(loginSuccess({ user: user }));
        setSuccess("Employee Login Success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else if (selectedUserType === "Admin") {
        await Adminloginvalidation.validate(
          { email, password },
          { abortEarly: false }
        );
        const data = await loginAdmin({ email, password });
        if (data.jwtToken) {
          localStorage.setItem("jwtToken", data.jwtToken);
          setSuccess("Admin Login Success");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 2000);
        }
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const formattedErrors = error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
        setError(formattedErrors);
      } else {
        setError("Invalid username or password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserTypeClick = (userType) => {
    setSelectedUserType(userType);
  };

  return (
    <div className="login-container">
      <div className="LoginPageBox">
        <div className="left-section">
          <div className="company-header-container">
            {/* <img src={companyLogo} alt="Hireflex Logo" className="logo" /> */}
          </div>
          <div className="image-section">
            <img src={loginpage} alt="Login Illustration" />
          </div>
        </div>
        <div className="right-section">
          <div className="login-header">
            <h1>
              {/* Welcome to{" "} */}
              <img
                src={companyLogo}
                alt="company-logo"
                className="company-logo1"
              />
            </h1>
          </div>
          <div className="UserSelectButton">
            <div className="user-type-selector">
              <DynamicButton
                text="Employee"
                onClick={() => handleUserTypeClick("Employee")}
                height="35px"
                width="150px"
                backgroundColor={
                  selectedUserType === "Employee" ? "#57002c" : "black"
                }
                color="white"
                isActive={selectedUserType === "Employee"}
              />
              <DynamicButton
                text="SuperAdmin"
                onClick={() => handleUserTypeClick("Super Admin")}
                height="35px"
                width="150px"
                backgroundColor={
                  selectedUserType === "Super Admin" ? "#57002c" : "black"
                }
                color="white"
                isActive={selectedUserType === "Super Admin"}
              />
              <DynamicButton
                text="Admin"
                onClick={() => handleUserTypeClick("Admin")}
                height="35px"
                width="150px"
                backgroundColor={
                  selectedUserType === "Admin" ? "#57002c" : "black"
                }
                color="white"
                isActive={selectedUserType === "Admin"}
              />
            </div>
          </div>
          {selectedUserType === "Super Admin" && (
            <div className="EmployeeLogin">
              <div className="login-background">
                <Box className="login-form-container">
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Enter Email"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                    <TextField
                      label="Enter Password"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                    />
                    {apiError && (
                      <Typography color="error" variant="body2">
                        {apiError}
                      </Typography>
                    )}
                    <div className="mt-3">
                      <button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="login-button"
                        disabled={isSubmitting}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  {error && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mt-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                      {success}
                    </div>
                  )}

                  <div className="text-black p-1 mt-4">
                    <Typography variant="body2">
                      <Link to="/register" style={{ cursor: "pointer" }}>
                        Need assistance with Login/Registration? <br />
                      </Link>
                    </Typography>
                    <Typography variant="body2" style={{ cursor: "pointer" }}>
                      Email: hr@hireflex247.com
                    </Typography>
                  </div>
                </Box>
              </div>
            </div>
          )}
          {selectedUserType === "Admin" && (
            <div className="EmployeeLogin">
              <div className="login-background">
                <Box className="login-form-container">
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Enter Email"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                    />
                    <TextField
                      label="Enter Password"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                    />
                    {apiError && (
                      <Typography color="error" variant="body2">
                        {apiError}
                      </Typography>
                    )}
                    <div className="mt-3">
                      <button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="login-button"
                        disabled={isSubmitting}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  {error && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mt-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                      {success}
                    </div>
                  )}
                  <div className="text-black p-1 mt-4">
                    <Typography variant="body2">
                      <Link to="/register" style={{ cursor: "pointer" }}>
                        Need assistance with Login/Registration? <br />
                      </Link>
                    </Typography>
                    <Typography variant="body2" style={{ cursor: "pointer" }}>
                      Email: hr@hireflex247.com
                    </Typography>
                  </div>
                </Box>
             
              </div>
            </div>
          )}
          {selectedUserType === "Employee" && (
            <div className="EmployeeLogin">
              <div className="login-background">
                <Box className="login-form-container">
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Enter EmployeeId"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      error={Boolean(errors.employeeId)}
                      helperText={errors.employeeId}
                    />
                    <TextField
                      label="Enter Password"
                      variant="outlined"
                      className="custom-text-field"
                      fullWidth
                      margin="normal"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                    />

                    <div className="mt-3">
                      <button
                        type="submit"
                        fullWidth
                        className="login-button"
                        disabled={isSubmitting}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                  {error && (
                    <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mt-3 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
                      {success}
                    </div>
                  )}
                  <div className="text-black p-1 mt-4 ">
                    <Typography variant="body2">
                      <Link to="#" style={{ cursor: "pointer" }}>
                        Need assistance helps? <br />
                      </Link>
                    </Typography>

                    <Typography variant="body2">
                      <Link to="#" style={{ cursor: "pointer" }}>
                        Email: hr@hireflex247.com
                      </Link>
                    </Typography>
                  </div>
                </Box>
               
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
