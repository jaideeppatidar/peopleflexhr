import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Paper,
  Box,
  Typography,
  FormControl,

} from "@mui/material";
import "./SingleEmpDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import DynamicButton from "../../../../../../components/DynamicButton/DynamicButton";

const SingleEmpDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = location.state || {};
  // const fullName = `${firstName || ""} ${lastName || ""}`.trim();
  console.log(firstName);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeType: "",
    },
  });

  const [selectedEmployeeType, setSelectedEmployeeType] = useState("");
  const [entitlementUnit, setEntitlementUnit] = useState("");

  const handleEntitlementUnitChange = (event) => {
    setEntitlementUnit(event.target.value);
  };

  const onSubmit = (data) => {
    console.log("Form submitted", data);
    navigate("/superadmin/empsummary");
    navigate("/superadmin/empdetails");
  };

  return (
    <>
      <div className="DetailsContainerEmployee">
        <div className="multi-header-employment-details">
          <p>Employee Details</p>
          <p>Employment Details</p>
          <p>Summary</p>
        </div>
        <div className="work-personal-container">
          {/* <div className="work-left-personal-container">
                    <div className="header-personal-work-left">
                        <div className="back-arrow-section">
                            <DynamicButton
                                text="Back"
                                onClick={() => navigate("/superadmin/emppersonaldetails")}
                                icon={ArrowBack}
                                height="40px"
                                width="100px"
                                backgroundColor="#6674a9"
                                color="#ffffff"
                            />
                        </div>
                        <div className="personal-name-section">
                            <span
                                style={{ fontSize: "20px", fontWeight: "600" }}
                            >{`${firstName} ${lastName}`}</span>
                        </div>
                    </div>

                    <div className="additional-work-left-container">
                        <Box display="flex" alignItems="center" spacing={1}>
                            <Box flexGrow={1} marginRight={2}>
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={commonStyle}
                                />
                            </Box>
                            <Box width="200px">
                                <TextField
                                    select
                                    label="Dropdown"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    sx={commonStyle}
                                >
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="firstName">First Name</MenuItem>
                                    <MenuItem value="lastName">Last Name</MenuItem>
                                </TextField>
                            </Box>
                        </Box>
                        <div className="personal-name-email-container" style={commonStyle}>
                            <div className="personal-name-email">
                                <span style={{ fontSize: '20px', fontWeight: '600' }}>{fullName}</span>
                                <p>{`${email}`}</p>
                            </div>
                        </div>
                    </div>
                </div> */}

          <div className="personal-work-right-container">
            <Paper
              elevation={3}
              className="employee-work-details-form-container"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="employee-work-details-form"
              >
                <div className="emp-work-location">
                  <h1 style={{ fontWeight: "500", fontSize: "23px" }}>
                    Location
                  </h1>
                  <div className="place-of-work">
                    <Box display="flex" alignItems="center" spacing={1}>
                      <div className="location-of-work">
                        <span style={{ fontWeight: "500" }}>
                          Public holidays observed for
                        </span>
                        <Box width="450px">
                          <TextField
                            select
                            label="Select jurisdiction"
                            variant="outlined"
                            fullWidth
                            required
                            margin="normal"
                          >
                            <MenuItem value="select jurisdiction">
                              Select jurisdiction
                            </MenuItem>
                            <MenuItem value="England & Wales">
                              England & Wales
                            </MenuItem>
                            <MenuItem value="Northern Ireland">
                              Northern Ireland
                            </MenuItem>
                            <MenuItem value="America">America</MenuItem>
                          </TextField>
                        </Box>
                      </div>
                    </Box>
                  </div>
                </div>

                <div className="employee-detail-container">
                  <Box
                   
                  >
                    <Typography variant="h6" gutterBottom fontWeight={"600"}>
                      Employment details
                    </Typography>
                    <FormControl
                      component="fieldset"
                      error={Boolean(errors.employeeType)}
                    >
                      <div className="both-full-part-time-container">
                        <Controller
                          name="employeeType"
                          control={control}
                          rules={{ required: "Employee type is required" }}
                          render={({ field }) => (
                            <div className="radio-options">
                              <div
                                className="left-radio-container"
                                onClick={() => {
                                  field.onChange("fixed");
                                  setSelectedEmployeeType("fixed");
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    field.onChange("fixed");
                                    setSelectedEmployeeType("fixed");
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <Box
                                  className={`full-time-part-time-work ${
                                    field.value === "fixed" ? "selected" : ""
                                  }`}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={"600"}
                                  >
                                    Fixed, full or part time
                                  </Typography>
                                  <Typography variant="body2">
                                    Employees on a repeating working time
                                    pattern who work fixed, predictable numbers
                                    of hours every week and have a fixed leave
                                    entitlement.
                                  </Typography>
                                </Box>
                              </div>
                              <div
                                className="right-radio-container"
                                onClick={() => {
                                  field.onChange("variable");
                                  setSelectedEmployeeType("variable");
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    field.onChange("variable");
                                    setSelectedEmployeeType("variable");
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <Box
                                  className={`full-time-part-time-work ${
                                    field.value === "variable" ? "selected" : ""
                                  }`}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={"600"}
                                  >
                                    Short hours or variable
                                  </Typography>
                                  <Typography variant="body2">
                                    Employees on a contract who work a different
                                    number of hours or days from week to week.
                                  </Typography>
                                </Box>
                              </div>
                            </div>
                          )}
                        />
                      </div>

                      {errors.employeeType && (
                        <Typography variant="body2" color="error">
                          {errors.employeeType.message}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </div>

                {selectedEmployeeType === "fixed" && (
                  <Box>
                    <div className="company-time-container">
                      <div className="time-title-header">
                        <div
                          className="company-title-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Working time pattern</span>
                          <span style={{ paddingRight: "250px" }}>
                            Company's full-time working week
                          </span>
                        </div>
                        <div
                         className="CompanyPatternDetails"
                        >
                          <TextField
                            select
                            label="Select jurisdiction"
                            variant="outlined"
                            required
                            style={{ width: "400px", marginRight: "16px" }}
                          >
                            <MenuItem value="select jurisdiction">
                              Monday - Friday 9-5 (5 Days , 35 Hrs)
                            </MenuItem>
                            <MenuItem value="select jurisdiction">
                              Monday - Friday (40 Hours Per Week) (5 Days 40
                              Hrs)
                            </MenuItem>
                          </TextField>
                          <TextField
                            label="Hrs"
                            type="number"
                            variant="outlined"
                            style={{ width: "255px" }}
                          />
                          <TextField
                            label="Min"
                            type="number"
                            variant="outlined"
                            style={{ width: "255px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                )}

                {selectedEmployeeType === "variable" && (
                  <Box>
                    <div className="full-week-time">
                      <p>Company's full time working week</p>
                      <TextField
                        label="Hrs"
                        type="number"
                        variant="outlined"
                        style={{ width: "255px", marginRight: "16px" }}
                      />
                      <TextField
                        label="Min"
                        type="number"
                        variant="outlined"
                        style={{ width: "255px" }}
                      />
                    </div>
                  </Box>
                )}

                <div className="employee-detail-container">
                  <div
                   
                  >
                    <Typography variant="h6" gutterBottom fontWeight={"600"}>
                      Contract details
                    </Typography>
                    <FormControl
                      component="fieldset"
                      error={Boolean(errors.entitlementUnit)}
                    >
                      <div className="both-full-part-time-second-container">
                        <Controller
                          name="entitlementUnit"
                          control={control}
                          rules={{ required: "Entitlement unit is required" }}
                          render={({ field }) => (
                            <div className="radio-options">
                              <div
                                className="second-left-radio-container"
                                onClick={() => {
                                  handleEntitlementUnitChange({
                                    target: { value: "days" },
                                  });
                                  field.onChange("days");
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleEntitlementUnitChange({
                                      target: { value: "days" },
                                    });
                                    field.onChange("days");
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <Box
                                  className={`full-time-part-time-work ${
                                    field.value === "days" ? "selected" : ""
                                  }`}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={"600"}
                                  >
                                    Days
                                  </Typography>
                                  <Typography variant="body2">
                                    The employee can take holiday in day or
                                    half-day units. They will be able to book
                                    appointments in hours and minutes.
                                    Entitlement, absence, and balance will be
                                    shown in days.
                                  </Typography>
                                </Box>
                              </div>
                              <div
                                className="second-right-radio-container"
                                onClick={() => {
                                  handleEntitlementUnitChange({
                                    target: { value: "hours" },
                                  });
                                  field.onChange("hours");
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleEntitlementUnitChange({
                                      target: { value: "hours" },
                                    });
                                    field.onChange("hours");
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <Box
                                  className={`full-time-part-time-work ${
                                    field.value === "hours" ? "selected" : ""
                                  }`}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={"600"}
                                  >
                                    Hours
                                  </Typography>
                                  <Typography variant="body2">
                                    The employee can take holiday in smaller
                                    increments. They will be able to book
                                    appointments in hours and minutes.
                                    Entitlement, absence, and balance will be
                                    shown in hours.
                                  </Typography>
                                </Box>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                      {errors.entitlementUnit && (
                        <Typography variant="body2" color="error">
                          {errors.entitlementUnit.message}
                        </Typography>
                      )}
                    </FormControl>
                  </div>
                </div>

                {entitlementUnit === "days" && (
                  <Box>
                    <div className="company-time-container">
                      <div className="time-title-header">
                        <div
                          className="company-title-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            Full time annual leave entitlement equivalent
                          </span>
                          <span style={{ paddingRight: "240px" }}>
                            Leave year start
                          </span>
                        </div>
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                          marginTop="16px"
                        >
                          <TextField
                            label="Full time annual leave"
                            type="number"
                            variant="outlined"
                            style={{ width: "550px", marginRight: "16px" }}
                          ></TextField>
                          <TextField
                            label="Date"
                            type="number"
                            variant="outlined"
                            style={{ width: "180px" }}
                          />
                          <TextField
                            label="Month"
                            type="month"
                            name="month"
                            variant="outlined"
                            fullWidth
                            sx={{ maxWidth: 180 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Box>
                      </div>
                    </div>
                  </Box>
                )}

                {entitlementUnit === "hours" && (
                  <Box>
                    <div className="company-time-container">
                      <div className="time-title-header">
                        <div
                          className="company-title-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            Full time annual leave entitlement equivalent
                          </span>
                          <span style={{ paddingRight: "240px" }}>
                            Leave year start
                          </span>
                        </div>
                        <Box
                          width="100%"
                          display="flex"
                          justifyContent="space-between"
                          marginTop="16px"
                        >
                          <TextField
                            label="Houres"
                            type="number"
                            variant="outlined"
                            style={{ width: "260px" }}
                          ></TextField>
                          <TextField
                            label="Minutes"
                            type="number"
                            variant="outlined"
                            style={{ width: "260px" }}
                          ></TextField>
                          <TextField
                            label="Date"
                            type="number"
                            variant="outlined"
                            style={{ width: "180px" }}
                          />
                          <TextField
                            label="Month"
                            type="month"
                            name="month"
                            variant="outlined"
                            fullWidth
                            sx={{ maxWidth: 180 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Box>
                      </div>
                    </div>
                  </Box>
                )}
                <div className="employee-detail-container">
                  <Box
                    sx={{
                      padding: "16px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      mt: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={"600"}>
                      Leave entitlement
                    </Typography>
                    <FormControl
                      component="fieldset"
                      error={Boolean(errors.employeeType)}
                    >
                      <Typography variant="subtitle1" component="legend">
                        We have calculated your employees annual leave
                        entitlement based on the information you have given us,
                        you can change this by entering into the fields below.
                      </Typography>
                      {entitlementUnit === "days" && (
                        <Box>
                          <div className="company-time-container">
                            <div className="time-title-header">
                              <div
                                className="company-title-header"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>Leave entitlement</span>
                                <span style={{ paddingRight: "310px" }}>
                                  Leave allowance
                                </span>
                              </div>
                              <Box
                                width="100%"
                                display="flex"
                                justifyContent="space-between"
                                marginTop="16px"
                              >
                                <TextField
                                  label="Leave entitlement"
                                  type="number"
                                  variant="outlined"
                                  style={{ width: "439px" }}
                                ></TextField>
                                <TextField
                                  label="Leave allowance"
                                  type="number"
                                  variant="outlined"
                                  style={{ width: "439px" }}
                                ></TextField>
                              </Box>
                            </div>
                          </div>
                        </Box>
                      )}

                      {errors.employeeType && (
                        <Typography variant="body2" color="error">
                          {errors.employeeType.message}
                        </Typography>
                      )}
                    </FormControl>

                    {entitlementUnit === "hours" && (
                      <Box>
                        <div className="company-time-container">
                          <div className="time-title-header">
                            <div
                              className="company-title-header"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>Leave entitlement</span>
                              <span style={{ paddingRight: "240px" }}>
                                Leave allowance
                              </span>
                            </div>
                            <Box
                              width="100%"
                              display="flex"
                              justifyContent="space-between"
                              marginTop="16px"
                            >
                              <TextField
                                label="Hours"
                                type="number"
                                variant="outlined"
                                style={{ width: "260px" }}
                              ></TextField>
                              <TextField
                                label="Minutes"
                                type="number"
                                variant="outlined"
                                style={{ width: "260px" }}
                              ></TextField>
                              <TextField
                                label="Hours"
                                type="number"
                                variant="outlined"
                                style={{ width: "170px" }}
                              />
                              <TextField
                                label="Minutes"
                                type="number"
                                name="month"
                                variant="outlined"
                                fullWidth
                                style={{ width: "170px" }}
                              />
                            </Box>
                          </div>
                        </div>
                      </Box>
                    )}
                  </Box>
                </div>
                <div className="save-and-continue-footer">
                  <div className="personal-button-container">
                    <DynamicButton
                      text="Start Over"
                      onClick={() => navigate("/superadmin/empdetails")}
                      height="40px"
                      width="200px"
                      backgroundColor="#6674a9"
                      color="#ffffff"
                    />

                    <DynamicButton
                      text="Save & Continue"
                      onClick={() => navigate("/superadmin/empsummary")}
                      height="40px"
                      width="200px"
                      backgroundColor="#6674a9"
                      color="#ffffff"
                    />
                  </div>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleEmpDetails;
