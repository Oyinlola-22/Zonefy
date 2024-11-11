import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CaretLeft, CaretRight } from "@phosphor-icons/react";
import "./propertyscreen.css";
import Property from "../../../assets/Property.jpg";
import Property1 from "../../../assets/Property1.jpg";
import Property2 from "../../../assets/Property2.jpg";

function PropertyScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve property data passed through navigation state
  const propertyData = location.state?.property;

  // Dummy image array
  const propertyImages = [Property, Property1, Property2];

  // State to manage the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Navigate to the ChatScreen when the button is clicked
  const handleChatClick = () => {
    navigate("/chat", { state: { ownerName: propertyData.ownerName } });
  };

  // Function to go to the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
    );
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
        <p className="property-title">{propertyData?.propertyName}</p>
      </div>

      <div className="body-container">
        <div className="property-row">
          {/* Property Image with navigation buttons */}
          <div className="property-image-container">
            <div className="image-carousel">
              <CaretLeft
                className="nav-button"
                size={40}
                onClick={handlePrevImage}
              />
              <img
                src={
                  propertyData?.propertyImageUrl?.length
                    ? propertyData.propertyImageUrl[currentImageIndex]
                    : propertyImages[currentImageIndex]
                }
                alt={propertyData?.propertyName}
                className="property-pic"
              />
              <CaretRight
                className="nav-button"
                size={40}
                onClick={handleNextImage}
              />
            </div>
          </div>

          {/* Property Info: Owned By and Are You Interested */}
          <div className="property-info-container">
            <div className="owned-by">
              <h2>Owned By</h2>
              <p>
                <strong>Owner:</strong> {propertyData?.ownerName}
              </p>
              <p>
                <strong>Location:</strong> {propertyData?.propertyLocation}
              </p>
            </div>

            <div className="contact-section">
              <h3>Are You Interested?</h3>
              <p>
                <strong>Contact:</strong> {propertyData?.ownerPhoneNumber}
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
          <p>{propertyData?.propertyDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default PropertyScreen;
