import React, { useState, useEffect } from "react";
import { House } from "@phosphor-icons/react";
import "./launchstyle.css";
import Property from "../../assets/zonefy.jpg";
import ListedProperties from "../../components/ListedProps/ListedProperties";
import SearchResults from "../../components/SearchResults/SearchResults"; // Import the SearchResults component
import { Link, useNavigate } from "react-router-dom";
import { selectZonefy, useAppSelector } from "../../Store/store";

function Launch() {
  const { userData } = useAppSelector(selectZonefy);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/home");
    }
  }, [userData, navigate]);

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/signup" style={{ color: "white" }}>
              Register
            </Link>
          </span>
          <span className="text1">
            <Link to="/signin" style={{ color: "white" }}>
              SignIn
            </Link>
          </span>
        </div>
      </div>

      <div className="image-container">
        <img src={Property} alt="Property" className="logo-image" />
        <div className="image-text">
          LOOKING FOR A SPACE AVAILABLE FOR RENT?
        </div>
      </div>

      {/* Always display the SearchResults */}
      <SearchResults />

      <ListedProperties />
    </div>
  );
}

export default Launch;
