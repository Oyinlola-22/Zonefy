import React, { useState } from "react";
import Property from "../../assets/Property2.jpg";
import "./Myproperties.css";
import { useNavigate } from "react-router-dom";

function Myproperty() {
  const navigate = useNavigate();

  // Example property data
  const [propertyData, setPropertyData] = useState([
    {
      id: 1,
      title: "Brand New 4 Bedroom Terrace Duplex With Swimming Pool",
      description:
        "Exquisitely finished 4-bedroom terrace duplex with a swimming pool in Ikeja GRA, available for a minimum rent of 2 years.",
      location: "Ikeja, Lagos",
      price: "₦5,000,000",
      features: {
        toilets: 5,
        garage: 1,
      },
      image: Property,
    },
    {
      id: 2,
      title: "Brand New 4 Bedroom Terrace Duplex With Swimming Pool",
      description:
        "Exquisitely finished 4-bedroom terrace duplex with a swimming pool in Ikeja GRA, available for a minimum rent of 2 years.",
      location: "Ikeja, Lagos",
      price: "₦5,000,000",
      features: {
        toilets: 5,
        garage: 1,
      },
      image: Property,
    },
    {
      id: 3,
      title: "Brand New 4 Bedroom Terrace Duplex With Swimming Pool",
      description:
        "Exquisitely finished 4-bedroom terrace duplex with a swimming pool in Ikeja GRA, available for a minimum rent of 2 years.",
      location: "Ikeja, Lagos",
      price: "₦5,000,000",
      features: {
        toilets: 5,
        garage: 1,
      },
      image: Property,
    },
    {
      id: 4,
      title: "Brand New 4 Bedroom Terrace Duplex With Swimming Pool",
      description:
        "Exquisitely finished 4-bedroom terrace duplex with a swimming pool in Ikeja GRA, available for a minimum rent of 2 years.",
      location: "Ikeja, Lagos",
      price: "₦5,000,000",
      features: {
        toilets: 5,
        garage: 1,
      },
      image: Property,
    },
  ]);

  // Handle property deletion
  const handleDelete = (id) => {
    setPropertyData(propertyData.filter((property) => property.id !== id));
  };

  return (
    <div className="listedProperties">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="backs-button">
        Go Back
      </button>

      <p className="title">My Properties</p>

      {/* Loop through property data */}
      <div className="rectangle-container">
        {propertyData.length > 0 ? (
          propertyData.map((property) => (
            <div className="rectangle" key={property.id}>
              <p className="header-text">{property.title}</p>
              <img
                src={property.image}
                alt={property.title}
                className="logo-image1"
              />
              <div className="details-container">
                <span className="description">{property.description}</span>
                <div className="property-info">
                  <span className="location">{property.location}</span>
                  <span className="price">{property.price}</span>
                </div>
                <div className="property-features">
                  <span>🚻 {property.features.toilets} toilets</span>
                  <span>🚗 {property.features.garage} parking lot</span>
                  <button
                    className="rent-button"
                    onClick={() => navigate("/details", { state: property })}
                  >
                    Click to view
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-properties-message">No properties available.</p>
        )}
      </div>
    </div>
  );
}

export default Myproperty;
