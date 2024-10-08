import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import "./propertyscreen.css";

function PropertyScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const propertyData = location.state || {};

  return (
    <div className="property-screen">
      {/* Header with back button */}
      <div className="header">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="back-button"
          size={40}
        />
        <p className="property-title">{propertyData.title}</p>
      </div>

      <div className="body-container">
        <div className="property-row">
          {/* Property Image */}
          <div className="property-image-container">
            <img
              src={propertyData.image}
              alt={propertyData.title}
              className="property-image"
            />
            {/* Navigation Arrows (optional) */}
            <div className="image-arrow1">&#10094;</div>
            <div className="image-arrow">&#10095;</div>
          </div>

          {/* "Owned By" and "Are You Interested" sections in one container */}
          <div className="property-info-container">
            <div className="owned-by">
              <h2>Owned By</h2>
              <p>{propertyData.ownedBy}</p>
              <p>{propertyData.ownedByAddress}</p>
            </div>

            <div className="contact-section">
              <h3>Are You Interested?</h3>
              <p>{propertyData.contact}</p>
              <p>{propertyData.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Property Description */}
        <div className="property-description">
          <h2>About this property</h2>
          <p>{propertyData.description}</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyScreen;
