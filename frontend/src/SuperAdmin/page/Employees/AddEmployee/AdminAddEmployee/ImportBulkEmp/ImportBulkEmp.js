import React, { useState } from "react";
import "./ImportBulkEmp.css";
import { uploadCSV } from "../../../../../ApiServices";
import Header from "../../../../../components/SuperAdminNavbar/SuperAdminNavbar";

const ImportBulkEmp = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadCSV(formData);
      setMessage("File uploaded successfully");
      setMessageType("success");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Error uploading file");
      setMessageType("error");
    }
  };

  return (
    <>
      {" "}
      <Header
        siteName={"Upload Bulk"}
        showLinks={["policies"]}
      />
      <div className="ContainerMainBulk">
      <div className="BulkImportContainer">
        <h2 className="BulkNameHeading">Upload Files</h2>
        <form onSubmit={handleSubmit}>
          <div className="file-upload-container">
            <label htmlFor="fileUpload">Select File here</label>
            <small>Files Supported: PDF, TEXT, DOC, DOCX</small>
            <input type="file" id="fileUpload" onChange={handleFileChange} />
          </div>
          <div className="button-container">
            <button type="submit">Upload CSV</button>
          </div>
        </form>
        {message && <div className={`alert ${messageType}`}>{message}</div>}
      </div>
      </div>
    </>
  );
};

export default ImportBulkEmp;
