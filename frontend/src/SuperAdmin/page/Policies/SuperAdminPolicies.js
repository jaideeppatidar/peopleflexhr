import React, { useState, useEffect } from "react";
import "./SuperAdminPolicies.css";
import Header from "../../components/SuperAdminNavbar/SuperAdminNavbar";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import CommonHeader from "../../../components/CommonHeader/index";
import { deletePolicies, fetchPoliciesDatas } from "../../ApiServices"; // Import your API function
import DownloadButton from "../../../Employee/components/DownloadButton";
import Policiesssubmitpopup from "../Policies/policiessubmitpopupo";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import IconMapper from "../../../components/IconMapper/IconMapper";
import { ToastContainer, toast } from "react-toastify";
const ITEMS_PER_PAGE = 6;

const Polices = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [allPolicies, setAllPolicies] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const policiesData = await fetchPoliciesDatas();
      console.log(policiesData);
      setAllPolicies(policiesData);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false); // End loading
    }
  };
  useEffect(() => {
    fetchPolicies();
  }, []);
  useEffect(() => {
    const filteredData = allPolicies.filter((document) =>
      document.policyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const newOffset = page * rowsPerPage;
    setCurrentItems(filteredData.slice(newOffset, newOffset + rowsPerPage));
  }, [searchQuery, page, rowsPerPage, allPolicies]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseConfirmationModal = () => {
    setDocumentToDelete(null);
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      handleDelete(documentToDelete);
      handleCloseConfirmationModal();
    }
  };

  const handleOpenConfirmationModal = (id) => {
    setDocumentToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleSelectDocuments = (name) => {
    setSelectedPolicies((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleDelete = async (id) => {
    try {
      await deletePolicies(id);
      await fetchPolicies();
      setSelectedPolicies((prevDocuments) =>
        prevDocuments.filter((doc) => doc.policiesId !== id)
      );
    } catch (error) {
      toast.error("Failed to delete perk");
    }
  };

  const handleSelectAll = (event) => {
    setIsSelectAllChecked(event.target.checked);
    if (event.target.checked) {
      setSelectedPolicies(currentItems.map((item) => item.policyName));
    } else {
      setSelectedPolicies([]);
    }
  };
  const handleViewFile = (fileName) => {
    const fileBaseUrl = process.env.REACT_APP_API_IMAGE;
    const fileUrl = `${fileBaseUrl}${fileName}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = () => {
    const selectedData = allPolicies.filter((document) =>
      selectedPolicies.includes(document.policyName)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,FileName,Current,Description,Upload Date"]
        .concat(
          selectedData.map(
            (item) =>
              `${item.policyName},${item.file},${item.current},${item.description},${item.uploadDate}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireflexPolicies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleFormSubmit = (data) => {
    console.log("Form Submitted", data);
    setIsPopupOpen(false);
  };
  const handleAddClick = () => {
    setIsPopupOpen(true);
  };
  const handleRefreshClick = () => {
    fetchPolicies();
  };

  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Policies"}
        profileImage={profileImage}
        showLinks={["policiessuperadmin"]}
      />
      <div className="Policies-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          selectedPayslips={selectedPolicies}
          handleDeleteSelected={handleDelete}
          showIcons={{ plus: true, trash: true, rotate: true, PdfIcon: false }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedPolicies}
          handleAddClick={handleAddClick}
          showSearchFilter={true}
          handleRefreshClick={handleRefreshClick}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="Policies-tablebody">
            <table className="Policies-table-data">
              <thead>
                <tr>
                  <th style={{ padding: "5px" }}>
                    <Checkbox
                      checked={isSelectAllChecked}
                      indeterminate={
                        selectedPolicies.length > 0 &&
                        selectedPolicies.length < currentItems.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  {/* <th>Policy Id</th> */}
                  <th>Policy Name</th>
                  <th>FileName</th>
                  <th>Current</th>
                  <th>Description</th>
                  <th>Upload Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((doc) => (
                  <tr key={doc.policyId}>
                    <td
                      // className="w-[10px]"
                      style={{ padding: "5px", textAlign: "left" }}
                    >
                      <Checkbox
                        checked={selectedPolicies.includes(doc.policyName)}
                        onChange={() => handleSelectDocuments(doc.policyName)}
                      />
                    </td>
                    {/* <td>{doc.policyId}</td> */}
                    <td data-label="Document Name">{doc.policyName}</td>
                    <td data-label="ReceiptFileName">
                      {doc.file ? (
                        <div
                          onClick={() => handleViewFile(doc.file)}
                          className="adminpoliciesview-file-button"
                        >
                          View 
                          <IconMapper className="PoliciesFilePngicon" iconName={"FilePngIco"}/>

                        </div>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td data-label="Current">
                      {doc.current ? "True" : "False"}
                    </td>
                    <td data-label="Description">
                      <div className="Policies-tooltip">
                        {doc.description?.length > 5
                          ? doc.description.slice(0, 5) + "..."
                          : doc.description}
                        <span className="Policies-tooltip-text">
                          {doc.description}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{ paddingRight: "95px" }}
                      data-label="Upload Date"
                    >
                      {doc.uploadDate}
                    </td>
                    <td>
                      <div className="perks-Action-DataButon">
                        <button
                          className="perks-Text-delete"
                          onClick={() =>
                            handleOpenConfirmationModal(doc.policiesId)
                          }
                        >
                          <IconMapper
                            iconName="Deletebtn"
                            className="perks-DeletebtnView"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="Policies-pagination-table-container">
              <DownloadButton
                onClick={handleDownload}
                className="Policies-download-button-table-data"
              />

              <TablePagination
                rowsPerPageOptions={[ITEMS_PER_PAGE, 10, 25]}
                component="div"
                count={allPolicies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>

            <Policiesssubmitpopup
              open={isPopupOpen}
              onClose={handleClosePopup}
              onSubmit={handleFormSubmit}
              fetchPolicies={fetchPolicies}
            />
            <ConfirmationModal
              open={showConfirmationModal}
              onClose={handleCloseConfirmationModal}
              onConfirm={handleConfirmDelete}
              title="Delete Policies"
              message="Are you sure you want to delete this Policies?"
            />
          </div>
        )}{" "}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Polices;
