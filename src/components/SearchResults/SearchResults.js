import React, { useState, useEffect } from "react";
import "./searchresults.css";
import Property from "../../assets/Property.jpg";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../Store/store";
import { GetAllProperty } from "../../Features/zonefySlice";

const SearchResults = () => {
  const dispatch = useAppDispatch();
  const { propertyData } = useAppSelector(selectZonefy);

  useEffect(() => {
    // Fetch properties based on page number
    dispatch(GetAllProperty(1));
  }, [dispatch]);

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed

  const handleSearch = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!location || !checkIn || !checkOut || !propertyType) {
      alert("Please fill in all required fields");
      return;
    }

    // Filter `propertyData` based on form inputs
    const filtered = propertyData?.data.filter((property) => {
      const matchesLocation = location
        ? property.propertyLocation
            ?.toLowerCase()
            .includes(location.toLowerCase())
        : true;
      const matchesGuests = guests ? property.guests >= guests : true;
      const matchesPropertyType = propertyType
        ? property.propertyType?.toLowerCase() === propertyType.toLowerCase()
        : true;

      const matchesDimensions = dimensions
        ? String(property.dimension).includes(dimensions)
        : true;

      return (
        matchesLocation &&
        matchesGuests &&
        matchesPropertyType &&
        matchesDimensions
      );
    });

    setFilteredResults(filtered || []); // Update the state to render filtered results
    setHasSearched(true); // Mark that a search has been performed
  };

  return (
    <div className="search-results">
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
            <option value="storage-space">Shop</option>
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
              required
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
              placeholder="E.g. 200sqm (square meter)"
              required
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
        ) : filteredResults.length > 0 ? (
          filteredResults.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image-container">
                <img
                  src={property.propertyImageUrl || Property}
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
                  <span>
                    {new Date(property.checkInTime).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
                <p>
                  Till:{" "}
                  <span>
                    {new Date(property.checkOutTime).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-properties">
            No properties available for your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
