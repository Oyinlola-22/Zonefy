import React, { useState } from "react";
import { House } from "@phosphor-icons/react";
import "./loggedin.css";
import Property from "../../../assets/Property2.jpg";
import ListedProperties from "../../../components/ListedProps/ListedProperties";
import SearchResults from "../../../components/SearchResults/SearchResults"; // Import the SearchResults component
import { Link } from "react-router-dom";

function LoggedIn() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // This function is no longer needed to trigger the display
    console.log("Search triggered");
  };

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <House size={40} color="#f2f2f2" weight="fill" />
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/place-property" style={{ color: "white" }}>
              Place a Property
            </Link>
          </span>
          <span className="text1">
            <Link to="/signin" style={{ color: "white" }}>
              Log Out
            </Link>
          </span>
        </div>
      </div>

      <div className="image-container">
        <img src={Property} alt="Property" className="logo-image" />
        <div className="image-text">SEARCH THROUGH FOR YOUR TASTE</div>

        <form className="search-container" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="location">Where:</label>
            <input
              type="text"
              id="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="check-in">Check In:</label>
            <input
              type="date"
              id="check-in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="check-out">Check Out:</label>
            <input
              type="date"
              id="check-out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guests">Guests:</label>
            <input
              type="number"
              id="guests"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="property-type">Property Type:</label>
            <select
              id="property-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Pick Property Type</option>
              <option value="hall">Hall</option>
              <option value="meeting-room">Meeting Room</option>
              <option value="storage-space">Storage Space</option>
            </select>
          </div>

          <button className="search-button" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* Always display the SearchResults */}
      <SearchResults />

      <ListedProperties />
    </div>
  );
}

export default LoggedIn;
