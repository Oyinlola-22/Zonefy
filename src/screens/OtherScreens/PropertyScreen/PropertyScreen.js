import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CaretLeft,
  CaretRight,
  Trash,
  PlusCircle,
  PencilSimple,
} from "@phosphor-icons/react";
import "./propertyscreen.css";
import Property from "../../../assets/Property.jpg";
import Property1 from "../../../assets/Property1.jpg";
import Property2 from "../../../assets/Property2.jpg";
import {
  useAppSelector,
  selectZonefy,
  useAppDispatch,
} from "../../../Store/store";
import { EditHouseProperty, UploadImage } from "../../../Features/zonefySlice";
import { message } from "antd";

function PropertyScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(selectZonefy);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    console.log("Selected files:", files); // Log the files to check
    setSelectedFiles(files);
  };

  useEffect(() => {
    setShowLoginMessage(userData === null);
  }, [userData]);

  const myPropertyData = location.state?.property;

  const isOwner = userData?.email === myPropertyData?.creatorEmail;

  // Dummy image array (In a real app, this would come from the server)
  const [propertyImages, setPropertyImages] = useState([
    Property,
    Property1,
    Property2,
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: myPropertyData?.id,
    creatorEmail: myPropertyData?.creatorEmail,
    ownerName: myPropertyData?.ownerName,
    ownerPhoneNumber: myPropertyData?.ownerPhoneNumber,
    propertyName: myPropertyData?.propertyName || "",
    propertyPrice: myPropertyData?.propertyPrice || "",
    propertyDescription: myPropertyData?.propertyDescription || "",
    propertyType: myPropertyData?.propertyType,
    propertyImageUrl: myPropertyData?.propertyImageUrl,
    propertyLocation: myPropertyData?.propertyLocation || "",
    toiletNumber: myPropertyData?.toiletNumber || "",
    parkingLot: myPropertyData?.parkingLot || "",
  });

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Updated Property Data:", editData);
    dispatch(EditHouseProperty(editData));
    setIsEditing(false);
  };

  // Limit number of images to 5
  const maxImages = 5;

  const handleChatClick = () => {
    navigate("/chat", {
      state: {
        ownerName: myPropertyData.ownerName,
        receiverEmail: myPropertyData.creatorEmail,
      },
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
    );
  };

  // Handle deleting an image
  const handleDeleteImage = (index) => {
    const updatedImages = propertyImages.filter((_, i) => i !== index);
    setPropertyImages(updatedImages);
    setCurrentImageIndex((prevIndex) =>
      prevIndex >= updatedImages.length ? 0 : prevIndex
    );
  };

  const handleAddImage = async () => {
    if (selectedFiles.length === 0) {
      message.error("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file)); // Append each file
    // formData.append("propertyId", myPropertyData.id);

    try {
      console.log("MyProps", myPropertyData.id);
      dispatch(UploadImage(formData, myPropertyData.id));
      message.success("Uploaded");
      setSelectedFiles([]); // Clear selected files after upload
    } catch (error) {
      message.error("Failed to upload images. Please try again.");
    }
  };

  return (
    <div className="property-screen">
      <div className="header">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="back-button"
          size={40}
        />
        <p className="property-title">{myPropertyData?.propertyName}</p>

        {isOwner && !isEditing && (
          <PencilSimple
            className="edit-icon"
            size={30}
            onClick={handleEditToggle}
          />
        )}
      </div>

      <div className="body-container">
        <div className="property-row">
          <div className="property-image-container">
            <div className="image-carousel">
              <CaretLeft
                className="nav-button"
                size={40}
                onClick={handlePrevImage}
              />

              <div className="image-wrapper">
                <img
                  src={
                    myPropertyData?.propertyImageUrl?.length
                      ? myPropertyData.propertyImageUrl[currentImageIndex]
                      : propertyImages[currentImageIndex]
                  }
                  alt={myPropertyData?.propertyName}
                  className="property-pic"
                />
                {isOwner && (
                  <Trash
                    className="delete-icon"
                    size={30}
                    onClick={() => handleDeleteImage(currentImageIndex)}
                  />
                )}
              </div>

              <CaretRight
                className="nav-button"
                size={40}
                onClick={handleNextImage}
              />
            </div>

            {/* Show Add Image button if the user is the owner and images are less than 5 */}
            {isOwner && propertyImages.length < maxImages && (
              <>
                <PlusCircle
                  className="add-image-icon"
                  size={40}
                  onClick={() => document.getElementById("file-input").click()} // Trigger file input click
                />
                <input
                  type="file"
                  id="file-input"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Hide the file input
                />
                <button className="upload-button" onClick={handleAddImage}>
                  Upload Image
                </button>
              </>
            )}
          </div>

          <div className="property-info-container">
            <div className="owned-by">
              <h2>Owned By</h2>
              <p>
                <strong>Owner:</strong> {myPropertyData?.ownerName}
              </p>
              <p>
                <strong>Location:</strong> {myPropertyData?.propertyLocation}
              </p>
            </div>

            <div className="contact-section">
              <h3>Are You Interested?</h3>
              <p>
                <strong>Contact:</strong> {myPropertyData?.ownerPhoneNumber}
              </p>

              {showLoginMessage ? (
                <button className="chat-button">
                  Login or create account to chat with owner
                </button>
              ) : (
                !isOwner && ( // Render this button only if the user is not the owner
                  <button className="chat-button" onClick={handleChatClick}>
                    Chat with Owner Now
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="property-description">
          <h2>About this property</h2>
          <p>{myPropertyData?.propertyDescription}</p>
        </div>

        {isOwner && isEditing && (
          <div className="edit-form">
            <h3>Edit Property</h3>
            <label>
              Property Name:
              <input
                type="text"
                name="propertyName"
                value={editData.propertyName}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Property Description:
              <textarea
                name="propertyDescription"
                value={editData.propertyDescription}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Property Location:
              <input
                type="text"
                name="propertyLocation"
                value={editData.propertyLocation}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Property Price:
              <input
                type="text"
                name="propertyPrice"
                value={editData.propertyPrice}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Number of Toilets:
              <input
                type="number"
                name="toiletNumber"
                value={editData.toiletNumber}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Number of Parking Lot:
              <input
                type="number"
                name="parkingLot"
                value={editData.parkingLot}
                onChange={handleInputChange}
              />
            </label>
            <div className="edit-buttons">
              <button className="save-button" onClick={handleSaveChanges}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyScreen;
