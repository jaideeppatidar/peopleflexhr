import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar/Navbar";
import "./Documents.css";
import Footer from "../../../components/Footer/footer";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import CommonHeader from "../../../components/CommonHeader/index";
import DownloadButton from "../../components/DownloadButton";
import AddDocumentPopup from "../Documents/AddDocumentPopup";
import { deleteDocument, fetchDocumentDataById } from "../../EmpApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import IconMapper from "../../../components/IconMapper/IconMapper";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";

const ITEMS_PER_PAGE = 6;

const EmployeeMyDocuments = () => {
  const [documentsData, setDocumentsData] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { employeeId } = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  const loadDialogues = async (id) => {
    setLoading(true);
    try {
      const data = await fetchDocumentDataById(id);
      setDocumentsData(data);
    } catch (error) {
      console.error("Error loading dialogues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      loadDialogues(employeeId);
    }
  }, [employeeId]);

  useEffect(() => {
    const filteredData = documentsData.filter((document) => {
      const matchesSearch = document.documentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter
        ? document.status === statusFilter
        : true;
      return matchesSearch && matchesStatus;
    });

    const newOffset = page * rowsPerPage;
    const paginatedData = filteredData.slice(
      newOffset,
      newOffset + rowsPerPage
    );
    setCurrentItems(paginatedData);
  }, [searchQuery, page, rowsPerPage, documentsData, statusFilter]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectDocuments = (id) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocuments(currentItems.map((item) => item.documentName));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleDelete = async () => {
    try {
      const selectedDocumentIds = documentsData
        .filter((doc) => selectedDocuments.includes(doc.documentName))
        .map((doc) => doc.documentId);
      for (const id of selectedDocumentIds) {
        await deleteDocument(id);
      }

      toast.success("Selected documents deleted successfully!");
      loadDialogues(employeeId);
      setSelectedDocuments([]);
    } catch (error) {
      console.error("Error deleting documents:", error);
      toast.error("Failed to delete documents. Please try again.");
    }
  };

  const handleDownload = () => {
    const csvHeaders = ["Document Name", "Upload Date", "Status"];
    const csvRows = selectedDocuments.map((documentName) => {
      const document = documentsData.find(
        (doc) => doc.documentName === documentName
      );
      return [document.documentName, document.uploadDate, document.status].join(
        ","
      );
    });

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "hireflex247.com.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleFormSubmit = (data) => {
    console.log("Form Submitted", data);
    setIsPopupOpen(false);
    loadDialogues(employeeId);
  };

  const handleRefreshClick = () => {
    setPage(0);
    loadDialogues(employeeId);
  };

  const handleViewFile = (fileName) => {
    const fileBaseUrl = process.env.REACT_APP_API_IMAGE;
    const fileUrl = `${fileBaseUrl}${fileName}`;
    window.open(fileUrl, "_blank");
  };

  const profileImage = "/assets/images/profile.jpg";

  return (
    <div>
      <Header
        siteName={"Document"}
        userName={"Jaideep"}
        profileImage={profileImage}
        showLinks={["documents"]}
      />
      <div className="Document-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          handleDeleteSelected={handleDelete}
          selectedPayslips={selectedDocuments}
          showIcons={{ plus: true, trash: true, rotate: true, PdfIcon: false }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedDocuments}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
          handleAddClick={handleAddClick}
          showSearchFilter={true}
          handleRefreshClick={handleRefreshClick}
        />
        {loading ? (
          <LinearIndeterminate />
        ) : (
          <div className="Document-tablebody">
            <table className="Document-table-data">
              <thead>
                <tr>
                  <th style={{ padding: "5px" }}>
                    <Checkbox
                      checked={
                        selectedDocuments.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      indeterminate={
                        selectedDocuments.length > 0 &&
                        selectedDocuments.length < currentItems.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Document Name</th>
                  <th>Upload Date</th>
                  <th>Image</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((document, index) => (
                  <tr key={index}>
                    <td style={{ padding: "5px", textAlign: "left" }}>
                      <Checkbox
                        checked={selectedDocuments.includes(
                          document.documentName
                        )}
                        onChange={() =>
                          handleSelectDocuments(document.documentName)
                        }
                      />
                    </td>
                    <td data-label="Document Name">{document.documentName}</td>
                    <td data-label="Upload Date">{document.uploadDate}</td>
                    <td data-label="Image">
                      {document.image ? (
                        <div
                          onClick={() => handleViewFile(document.image)}
                          className="view-image-button"
                        >
                          View
                          <IconMapper
                            className="ImageUpload"
                            iconName={"ImageUpload"}
                          />
                        </div>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={document.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="Document-pagination-table-container">
              <DownloadButton
                onClick={handleDownload}
                className="Document-download-button-table-data"
              />
              <TablePagination
                rowsPerPageOptions={[ITEMS_PER_PAGE, 10, 25]}
                component="div"
                count={documentsData.filter(
                  (doc) =>
                    doc.documentName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    (statusFilter ? doc.status === statusFilter : true)
                ).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          </div>
        )}
        <Footer />
      </div>

      <AddDocumentPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleFormSubmit}
        loadDialogues={loadDialogues}
      />
    </div>
  );
};

export default EmployeeMyDocuments;
