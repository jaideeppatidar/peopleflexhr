import React, { useState, useEffect } from "react";
import "./Perks.css";
import Header from "../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";
import { Link } from "react-router-dom";
import CommonHeader from "../../../components/CommonHeader/index";
import LinearIndeterminate from "../../../components/Linearindeterminate/Linearindeterminate";
import DynamicButton from "../../../components/DynamicButton/DynamicButton";
import { fetchPerksDatas } from "../../EmpApiServices";

const PerksData = () => {
  const [showAll, setShowAll] = useState(true);
  const [isInternalActive, setIsInternalActive] = useState(null);
  const [perks, setPerks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null); // Holds perksId of the perk to show details for

  const handleTogglePerks = (type) => {
    if (type === "All") {
      setShowAll(true);
      setIsInternalActive(null);
    } else if (type === "Internal") {
      setShowAll(false);
      setIsInternalActive(true);
    } else if (type === "External") {
      setShowAll(false);
      setIsInternalActive(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchPerksDatas();
      setPerks(data);
    } catch (error) {
      setError("Failed to fetch perks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPerks = perks.filter((perk) => {
    if (showAll) return true;
    if (isInternalActive === true)
      return perk.category && perk.category.toLowerCase() === "internal";
    if (isInternalActive === false)
      return perk.category && perk.category.toLowerCase() === "external";
    return false;
  });

  const handleRefreshClick = () => {
    fetchData();
  };

  const toggleDetails = (perksId) => {
    // Toggle details for the specific perk
    setShowDetails((prevState) => (prevState === perksId ? null : perksId));
  };

  return (
    <>
      <Header siteName={"Perks"} userName={"Jaideep"} showLinks={["perks"]} />
      <div className="my-perks-container">
        <CommonHeader
          showIcons={{ plus: false, trash: false, rotate: true }}
          showCheckbox={false}
          handleRefreshClick={handleRefreshClick}
          showSearchFilter={false}
        />
        <div className="tablebody">
          <section>
            <div className="FilterPerks">
              <h2>Sort By Tags</h2>
              <DynamicButton
                text="All"
                onClick={() => handleTogglePerks("All")}
                height="40px"
                width="100px"
                backgroundColor={showAll ? "#1976d2" : "#6674a9"} 
                color="#fff"
              />
              <DynamicButton
                text="Internal"
                onClick={() => handleTogglePerks("Internal")}
                height="40px"
                width="100px"
                backgroundColor={isInternalActive ? "#1976d2" : "#6674a9"} 
                color="#fff"
              />
              <DynamicButton
                text="External"
                onClick={() => handleTogglePerks("External")}
                height="40px"
                width="100px"
                backgroundColor={
                  isInternalActive === false ? "#1976d2" : "#6674a9"
                } // Change color based on state
                color="#fff"
              />
            </div>
          </section>
          {loading ? (
            <LinearIndeterminate />
          ) : (
            <section>
              <div className="Perks-content">
                {error ? (
                  <div>{error}</div>
                ) : (
                  filteredPerks.map((perk) => (
                    <div key={perk.perksId} className="box">
                      <div className="perks-header">
                        <div style={{ paddingRight: "10px" }}>
                          <img
                            src={`${process.env.REACT_APP_API_IMAGE}/${perk.image}`}
                            alt="perk-icon"
                          />
                        </div>
                        <div>
                          <div className="title">{perk.perkName}</div>
                        </div>
                      </div>
                      <div className="btn-container">
                        <div
                          className="Perks-show"
                          onClick={() => toggleDetails(perk.perksId)} // Toggle the perk details
                        >
                          <h2>{showDetails === perk.perksId ? "Hide Details" : "Show Details"}</h2>
                        </div>
                        {showDetails === perk.perksId && (
                          <div className="details-content">
                            <p>{perk.description}</p>
                            <div>
                              Url:{" "}
                              <div style={{ color: "blue" }}>
                                <Link to={perk.url}>{perk.url}</Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer
        paragraph="If you have any questions or need further information about our benefits, please don't hesitate to email HR@hireflex247.com. Our HR team is always ready to assist you with any queries or clarifications you may need."
      />
    </>
  );
};



export default PerksData;
