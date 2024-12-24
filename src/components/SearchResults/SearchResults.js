import React, { useState, useEffect } from "react";
import "./searchresults.css";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../Store/store";
import { SearchHouseProperty } from "../../Features/zonefySlice";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const dispatch = useAppDispatch();
  const { searchData } = useAppSelector(selectZonefy);
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [hasSearched, setHasSearched] = useState(false); // To track if search was performed

  const handleSearch = (e) => {
    e.preventDefault();

    if (!location || !checkIn || !checkOut || !propertyType) {
      alert("Please fill in all required fields.");
      return;
    }

    // Dispatch search action with form inputs
    dispatch(
      SearchHouseProperty({
        locationOrPostCode: location,
        checkIn,
        checkOut,
        propertyType,
        pageNumber,
        dimensions, // Pass dimensions for shop or storage
        guests, // Pass guests for hall or meeting-room
      })
    );

    setHasSearched(true); // Mark that a search has been performed
  };

  const handleNextPage = () => {
    if (pageNumber < searchData?.totalPages) {
      setPageNumber((prevPage) => prevPage + 1);
      dispatch(
        SearchHouseProperty({
          locationOrPostCode: location,
          checkIn,
          checkOut,
          propertyType,
          pageNumber: pageNumber + 1,
          dimensions,
          guests,
        })
      );
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
      dispatch(
        SearchHouseProperty({
          locationOrPostCode: location,
          checkIn,
          checkOut,
          propertyType,
          pageNumber: pageNumber - 1,
          dimensions,
          guests,
        })
      );
    }
  };

  return (
    <div className="search-results">
      <form className="search-container" onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="location">Where:</label>
          <input
            type="text"
            id="location"
            placeholder="Enter location or postcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="check-in">Check In:</label>
          <input
            type="datetime-local"
            id="check-in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="check-out">Check Out:</label>
          <input
            type="datetime-local"
            id="check-out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
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
            <option value="shop">Shop</option>
          </select>
        </div>

        {["hall", "meeting-room"].includes(propertyType) && (
          <div className="form-group">
            <label htmlFor="guests">How many guests?:</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="E.g. 200"
            />
          </div>
        )}

        {["storage-space", "shop"].includes(propertyType) && (
          <div className="form-group">
            <label htmlFor="dimensions">Space Dimensions:</label>
            <input
              type="text"
              id="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="E.g. 200sqm"
            />
          </div>
        )}

        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      <div className="results-grid">
        {!hasSearched ? (
          <p className="search-instruction">
            Use the search form above to find properties.
          </p>
        ) : searchData?.data?.length > 0 ? (
          searchData.data.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image-container">
                <img
                  src={property.propertyImageUrl[0]}
                  alt={property.propertyName}
                  className="property-image"
                />
              </div>
              <div className="property-card-header">
                <h4>{property.propertyName}</h4>
                <p className="property-type">{property.propertyType}</p>
              </div>
              <div className="property-details">
                <p>
                  Location: <span>{property.propertyLocation}</span>
                </p>
                <p>
                  Available from:{" "}
                  <span>{new Date(property.checkInTime).toLocaleString()}</span>
                </p>
                <p>
                  Till:{" "}
                  <span>
                    {new Date(property.checkOutTime).toLocaleString()}
                  </span>
                </p>

                <button
                  className="rent-button"
                  onClick={() => navigate("/details", { state: { property } })}
                >
                  View Property
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-properties">
            No properties match your search criteria.
          </p>
        )}
      </div>

      <div className="pagination-controls">
        {hasSearched && searchData?.totalPages > 1 && (
          <>
            <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
              Previous
            </button>
            <span>
              Page {pageNumber} of {searchData.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageNumber >= searchData.totalPages}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
