import React from "react";
import "./searchresults.css";
import Property from "../../assets/Property.jpg";
import Property1 from "../../assets/Property1.jpg";
import Property2 from "../../assets/Property2.jpg";

const SearchResults = () => {
  const results = [
    {
      id: 1,
      name: "Sunny Hall",
      location: "Lagos",
      type: "Hall",
      guests: 200,
      imageUrl: Property,
    },
    {
      id: 2,
      name: "Grand Meeting Room",
      location: "Abuja",
      type: "Meeting Room",
      guests: 50,
      imageUrl: Property1,
    },
    {
      id: 3,
      name: "Cozy Storage Space",
      location: "Ibadan",
      type: "Storage Space",
      guests: 10,
      imageUrl: Property2,
    },
  ];

  return (
    <div className="search-results">
      <h3 className="results-title">Search Results</h3>
      <div className="results-grid">
        {results.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-image-container">
              <img
                src={property.imageUrl}
                alt={property.name}
                className="property-image"
              />
            </div>
            <div className="property-card-header">
              <h4>{property.name}</h4>
              <p className="property-type">{property.type}</p>
            </div>
            <div className="property-details">
              <p>
                Location: <span>{property.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
