import React, { useState } from "react";
import { House } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import "./loggedin.css";
import Property from "../../../assets/Property2.jpg";
import ListedProperties from "../../../components/ListedProps/ListedProperties";
import SearchResults from "../../../components/SearchResults/SearchResults";

function LoggedIn() {
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // State for form inputs (search functionality)
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search triggered");
  };

  // Function to show the logout confirmation modal
  const handleLogoutClick = () => {
    setShowModal(true);
  };

  // Function to confirm logout and navigate to home page
  const confirmLogout = () => {
    setShowModal(false);
    navigate("/");
  };

  // Function to cancel the logout process
  const cancelLogout = () => {
    setShowModal(false);
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
            <span
              onClick={handleLogoutClick}
              style={{ color: "white", cursor: "pointer" }}
            >
              Log Out
            </span>
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

      {/* Modal for Logout Confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmLogout}>
                Yes, Log Out
              </button>
              <button className="cancel-button" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoggedIn;
