import React from "react";
import "./searchresults.css"; // Add CSS for styling

const SearchResults = () => {
  const results = [
    { id: 1, name: "Sunny Hall", location: "Lagos", type: "Hall", guests: 200 },
    {
      id: 2,
      name: "Grand Meeting Room",
      location: "Abuja",
      type: "Meeting Room",
      guests: 50,
    },
    {
      id: 3,
      name: "Cozy Storage Space",
      location: "Ibadan",
      type: "Storage Space",
      guests: 10,
    },
  ];

  return (
    <div className="search-results">
      <h3 className="results-title">Search Results</h3>
      <div className="results-grid">
        {results.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-card-header">
              <h4>{property.name}</h4>
              <p className="property-type">{property.type}</p>
            </div>
            <div className="property-details">
              <p>
                Location: <span>{property.location}</span>
              </p>
              <p>
                Guests: <span>{property.guests}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
