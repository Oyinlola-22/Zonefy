import React from "react";
import "./listedprop.css";
import Property from "../../assets/Property1.jpg";
import { useNavigate } from "react-router-dom";

function ListedProperties() {
  const navigate = useNavigate();

  // Example property data
  const propertyData = [
    {
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
  ];

  return (
    <div className="listedProperties">
      <p className="title">Latest Listed Properties</p>

      {/* Loop through property data */}
      <div className="rectangle-container">
        {propertyData.map((property, index) => (
          <div className="rectangle" key={index}>
            {/* Navigate and pass individual property details */}
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
                  Click to rent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListedProperties;
