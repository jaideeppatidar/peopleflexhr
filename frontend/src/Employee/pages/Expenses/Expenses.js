// src/components/Expenses/Expenses.js

import React, { useState, useEffect } from "react";
import "./Expenses.css";
import Header from "../../components/Navbar/Navbar";
import Checkbox from "@mui/material/Checkbox";
import PopupForm from "./ExpensePopup";
import { TablePagination } from "@mui/material";
import CommonHeader from "../../../components/CommonHeader/index";
import DownloadButton from "../../components/DownloadButton";
import { fetchExpenses } from "../../EmpApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import { useSelector } from "react-redux";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import IconMapper from "../../../components/IconMapper/IconMapper";

const profileImage = "/assets/images/profile.jpg";

const Expenses = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const employeeId = useSelector((state) => state.auth.user.employeeId);
  const loadExpenses = async (id) => {
    setLoading(true);
    try {
      const data = await fetchExpenses(id);
      let expensesArray = [];
      if (Array.isArray(data)) {
        expensesArray = data;
      } else if (data && typeof data === "object") {
        expensesArray = [data];
      }
      setFilteredDocuments(expensesArray);
    } catch (error) {
      console.error("Error loading dialogues:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (employeeId) {
      loadExpenses(employeeId);
    }
  }, [employeeId]);

  const currentDocuments = filteredDocuments.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleFormSubmit = async (data) => {
    try {
      await data;
      console.log("Expense added successfully");
      loadExpenses();
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedDocuments(currentDocuments.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleRefreshClick = () => {
    if (employeeId) {
      loadExpenses(employeeId);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await selectedDocuments;
      console.log("Expenses deleted successfully");
      loadExpenses();
      setSelectedDocuments([]);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };
  const handleViewFile = (fileName) => {
    const fileBaseUrl = process.env.REACT_APP_API_IMAGE;
    const fileUrl = `${fileBaseUrl}${fileName}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = () => {
    const selectedData = filteredDocuments.filter((document) =>
      selectedDocuments.includes(document.policyName)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "EmployeeId,	Name,	ExpenseDate,	ExpenseType,	Amount	,Description,	FileName	,Status,",
      ]
        .concat(
          selectedData.map(
            (item) =>
              `${item.employeeId},${item.employeeName},${item.expenseDate},${item.expenseType},${item.amount},${item.expenseDescription},${item.receiptFileName} ,${item.status}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireflexdExpenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header
        siteName={"Expenses"}
        profileImage={profileImage}
        showLinks={["expenses"]}
      />
      <div className="Expenses-table-container">
        <CommonHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDeleteSelected={handleDeleteSelected}
          selectedPayslips={selectedDocuments}
          handleAddClick={handleAddClick}
          showIcons={{ plus: true, trash: true, rotate: true, PdfIcon: false }}
          selectedDocuments={selectedDocuments}
          currentDocuments={currentDocuments}
          handleSelectAll={handleSelectAll}
          handleRefreshClick={handleRefreshClick}
          showSearchFilter={true}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="Expenses-tablebody">
            <table className="Expenses-table-data">
              <thead>
                <tr>
                  <th style={{ padding: "5px" }}>
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
                  </th>
                  {/* <th>ExpenseId</th> */}
                  <th>EmployeeId</th>
                  <th>Name</th>
                  <th>ExpenseDate</th>
                  <th>ExpenseType</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>FileName</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentDocuments.map((doc) =>
                  doc ? (
                    <tr key={doc._id}>
                      <td>
                        <Checkbox
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                        />
                      </td>
                      <td data-label="EmployeeId">{doc.employeeId}</td>
                      <td data-label="EmployeeName">{doc.employeeName}</td>
                      <td data-label="ExpenseDate">{doc.expenseDate}</td>
                      <td data-label="ExpenseType">{doc.expenseType}</td>
                      <td data-label="Amount">{doc.amount}</td>
                      <td data-label="Description">{doc.expenseDescription}</td>
                      <td data-label="ReceiptFileName">
                        {doc.receiptFileName ? (
                          <div
                            onClick={() => handleViewFile(doc.receiptFileName)}
                            className="expenses-file-button"
                          >
                            View 
                          <IconMapper className="ExpensesFilePngicon" iconName={"FilePngIco"}/>

                          </div>
                        ) : (
                          "No File"
                        )}
                      </td>
                      <td data-label="Status">
                      <StatusBadge status={doc.status} />
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
            <div className="Expenses-pagination-table-container">
              <div>
                <DownloadButton
                  onClick={handleDownload}
                  className="Expenses-download-button-table-data"
                />
              </div>
              <div className="flex gap-3">
                <TablePagination
                  component="div"
                  count={filteredDocuments.length}
                  page={currentPage}
                  onPageChange={handlePageChange}
                  rowsPerPage={itemsPerPage}
                  rowsPerPageOptions={[6, 10, 20]}
                  onRowsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          </div>
        )}{" "}
      </div>
      <PopupForm
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleFormSubmit}
        loadExpenses={loadExpenses}
      />
    </div>
  );
};

export default Expenses;
