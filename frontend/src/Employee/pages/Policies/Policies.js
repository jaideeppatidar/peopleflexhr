import React, { useState, useEffect } from "react";
import "./Policies.css";
import Header from "../../components/Navbar/Navbar";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import DownloadButton from "../../components/DownloadButton/index";
import CommonHeader from "../../../components/CommonHeader/index";
import { fetchPoliciesDatas } from "../../EmpApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import IconMapper from "../../../components/IconMapper/IconMapper";

const ITEMS_PER_PAGE = 6;

const Polices = () => {
  const [currentItems, setCurrentItems] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    setLoading(true);

    try {
      const policiesData = await fetchPoliciesDatas();
      setAllPolicies(policiesData);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
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

  const handleSelectDocuments = (name) => {
    setSelectedPolicies((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleSelectAll = (event) => {
    setIsSelectAllChecked(event.target.checked);
    if (event.target.checked) {
      setSelectedPolicies(currentItems.map((item) => item.policyName));
    } else {
      setSelectedPolicies([]);
    }
  };

  const handleDownload = () => {
    const selectedData = allPolicies.filter((document) =>
      selectedPolicies.includes(document.policyName)
    );
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,UploadDate,FileName"]
        .concat(
          selectedData.map(
            (item) => `${item.policyName},${item.uploadDate},${item.file}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hireflexdocument.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshClick = () => {
    fetchPolicies();
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
        siteName={"Policies"}
        userName={"Arj"}
        profileImage={profileImage}
        showLinks={["policies"]}
      />
      <div className="Policies-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          selectedPayslips={selectedPolicies}
          showIcons={{
            plus: false,
            trash: false,
            rotate: true,
            PdfIcon: false,
          }}
          handleSelectAll={handleSelectAll}
          currentDocuments={currentItems}
          selectedDocuments={selectedPolicies}
          handleRefreshClick={handleRefreshClick}
          showSearchFilter={true}
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
                  <th>Policy Name</th>
                  <th>FileName</th>
                  <th>Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((doc) => (
                  <tr key={doc.policyId}>
                    <td
                      className="w-[10px]"
                      style={{ padding: "5px", textAlign: "left" }}
                    >
                      <Checkbox
                        checked={selectedPolicies.includes(doc.policyName)}
                        onChange={() => handleSelectDocuments(doc.policyName)}
                      />
                    </td>
                    <td data-label="Document Name">{doc.policyName}</td>
                    <td data-label="ReceiptFileName">
                      {doc.file ? (
                        <div
                          onClick={() => handleViewFile(doc.file)}
                          className="view-file-buttons"
                        >
                          View 
                          <IconMapper className="FilePngicon" iconName={"FilePngIco"}/>
                        </div>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td data-label="Upload Date">{doc.uploadDate}</td>
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
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default Polices;
