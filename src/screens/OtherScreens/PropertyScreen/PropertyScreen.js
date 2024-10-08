import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import "./propertyscreen.css";

function PropertyScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const propertyData = location.state || {};

  // Navigate to the ChatScreen when the button is clicked
  const handleChatClick = () => {
    navigate("/chat", { state: { ownerName: "Double King Estate Limited" } });
  };

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
          </div>

          {/* Property Info: Owned By and Are You Interested */}
          <div className="property-info-container">
            <div className="owned-by">
              <h2>Owned By</h2>
              <p>
                <strong>Owner:</strong> Double King Estate Limited
              </p>
              <p>
                <strong>Location:</strong> 17a Ayodele Fanoiki Street, Magodo
                Phase 1, Ikeja, Lagos, Nigeria
              </p>
            </div>

            <div className="contact-section">
              <h3>Are You Interested?</h3>
              <p>
                <strong>Contact:</strong> 080100223393, 080100223393
              </p>
              <button className="chat-button" onClick={handleChatClick}>
                Chat with Owner Now
              </button>
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
