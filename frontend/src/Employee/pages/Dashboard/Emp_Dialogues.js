import React, { useState, useEffect, useMemo } from "react";
import "./Emp_Dialogues.css";
import Header from "../../components/Navbar/Navbar";
import TablePagination from "@mui/material/TablePagination";
import CommonHeader from "../../../components/CommonHeader/index";
import { fetchDialogueSessions } from "../../EmpApiServices";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import { useSelector } from "react-redux";


const ITEMS_PER_PAGE = 6;

const MeetingPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPolicies, setAllPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { employeeId } = useSelector((state) => state.auth.user);

  const fetchPolicies = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetchDialogueSessions(employeeId);
     
        setAllPolicies(response); 
     
    } catch (error) {
      console.error("Error fetching policies:", error);
      setAllPolicies([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (employeeId) {
      fetchPolicies(employeeId);
    }
  }, [employeeId]);

  const filteredData = useMemo(() => {
    const filtered = allPolicies.filter((document) =>
      document.meetingType?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [allPolicies, searchQuery, page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefreshClick = () => {
    fetchPolicies(employeeId);
  };

  return (
    <div>
      <Header siteName={"Dialogues"} showLinks={["meeting"]} />
      <div className="Policies-table-container">
        <CommonHeader
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          showIcons={{
            plus: false,
            trash: false,
            rotate: true,
            PdfIcon: false,
          }}
          currentDocuments={filteredData}
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
                  <th>MeetingType</th>
                  <th>ReviewDate</th>
                  <th>NextMeetingDate</th>
                  <th>Comment</th>
                  <th>MeetingURL</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((doc) => (
                    <tr key={doc._id}>
                      <td data-label="MeetingType">{doc.meetingType}</td>
                      <td data-label="ReviewDate">{doc.reviewDate}</td>
                      <td data-label="NextMeetingDate">{doc.nextMeetingDate}</td>
                      <td data-label="CommentsAndNotes">
                        {doc.commentsAndNotes}
                      </td>
                      <td data-label="MeetingURL">
                        <a
                          className="joinmeeting"
                          href={doc.meetingURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Meeting
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No meetings found. Please refresh or try again later.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="Policies-pagination-table-container">
              <div className="Policies-download-button-table-data"></div>
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
        )}
      </div>
    </div>
  );
};

export default MeetingPage;
