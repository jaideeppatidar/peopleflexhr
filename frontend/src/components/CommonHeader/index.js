import React, {  useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import SearchInput from "../SearchTextField/index";
import IconMapper from "../IconMapper/IconMapper";
import "./Commonheader.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { Checkbox } from "@mui/material";
const CommonHeader = ({
  title,
  searchTerm = "",
  setSearchTerm,
  handleDeleteSelected,
  selectedPayslips = [],
  handleAddClick,
  showIcons,
  selectedDocuments = [],
  currentDocuments = [],
  handleSelectAll,
  setStatusFilter,
  showCheckbox,
  statusFilter,
  showStatusFilter,
  showCalendor,
  showSearchFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  handleResetFilters,
  handleRefreshClick,
  timeoffRequestCalendar,
  selectedYear,
  handleYearChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleTrashClick = () => {
    if (selectedPayslips.length > 0) {
      setModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteSelected();
  };

  return (
    <div className="payslips-header">
      <div className="flex  input-text">
        {showCheckbox && (
          <div className="checkboxcommonheader">
            <Checkbox
              checked={
                selectedDocuments.length === currentDocuments.length &&
                currentDocuments.length > 0
              }
              indeterminate={
                selectedDocuments.length > 0 &&
                selectedDocuments.length < currentDocuments.length
              }
              onChange={handleSelectAll}
            />
          </div>
        )}
        {showSearchFilter && (
          <SearchInput
            className="SearchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
        )}
        {timeoffRequestCalendar && (
          <div className="timeoff-year-selector">
           
            <select
              id="year"
              className="select-year"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {Array.from(
                { length: 11 },
                (_, index) => new Date().getFullYear() + index
                  ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {showCalendor && (
          <div className="date-filter-container">
            <TextField
              // label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputProps={{
                sx: {
                  padding: 0, // Set padding to 0
                  "& .MuiInputBase-input": {
                    padding: "7px", // Ensure the input padding is set to 0
                  },
                },
              }}
            />
            <TextField
              // label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputProps={{
                sx: {
                  padding: 0, // Set padding to 0
                  "& .MuiInputBase-input": {
                    padding: "7px", // Ensure the input padding is set to 0
                  },
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              style={{ width: "100px" }}
            >
              Reset
            </Button>
          </div>
        )}

{showStatusFilter && ( // Conditionally render status filter
  <FormControl
    variant="outlined"
    size="small"
    style={{ minWidth: 120, marginLeft: "10px" }}
  >
    <InputLabel>Filter</InputLabel>
    <Select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
      }}
      label="Filter"
      inputProps={{
        sx: {
          padding: 0, // Set padding to 0
          "& .MuiSelect-select": {
            paddingRight: "0px", // Set right padding to 0
          },
        },
      }}
      sx={{
        "& .MuiSelect-select": {
          padding: "10px", // Ensure the select input padding is set to 0
        },
      }}
    >
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Approved">Approved</MenuItem>
      <MenuItem value="Rejected">Rejected</MenuItem>
    </Select>
  </FormControl>
)}

      </div>
      <div className="payslips-actions">
        {showIcons.plus && (
          <div className="Icon-css" onClick={handleAddClick}>
            <IconMapper iconName="plus" isFontAwesome={true} />
          </div>
        )}
        {showIcons.rotate && (
          <div onClick={handleRefreshClick} className="Icon-css">
            <IconMapper iconName="rotate" isFontAwesome={true} />
          </div>
        )}
        {showIcons.trash && selectedPayslips.length > 0 && (
          <div
            className="text-delete Icon-css"
            onClick={handleTrashClick}
            style={{
              cursor: selectedPayslips.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <IconMapper iconName="trash" isFontAwesome={true} />
          </div>
        )}
        {showIcons.PdfIcon && (
          <div className="xlsxIcon">
            <IconMapper iconName="Xlsx" />
          </div>
        )}
      </div>
      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={"Are you sure you want to delete"}
        message={"Are you sure you want to delete"}
      />
    </div>
  );
};

export default CommonHeader;
