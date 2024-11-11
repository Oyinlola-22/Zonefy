import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import "./placeproperty.css";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import { PlaceHouse } from "../../Features/zonefySlice";

function PlaceProperty() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData, notifyMessage } = useAppSelector(selectZonefy);
  const [ownersName, setOwnersName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [propertysName, setPropertysName] = useState("");
  const [propertysLocation, setPropertysLocation] = useState("");
  const [propertysPrice, setPropertysPrice] = useState("");
  const [propertysDescription, setPropertysDescription] = useState("");
  const [propertysType, setPropertysType] = useState("");
  const [toilets, setToilets] = useState("");
  const [parkingLots, setParkingLots] = useState("");
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);

  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const payload = {
    creatorEmail: userData.email,
    ownerName: ownersName,
    ownerPhoneNumber: ownerPhone,
    propertyName: propertysName,
    propertyprice: propertysPrice,
    propertyDescription: propertysDescription,
    propertyType: propertysType,
    propertyLocation: propertysLocation,
    toiletNumber: toilets,
    parkingLot: parkingLots,
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    dispatch(PlaceHouse(payload));
    // setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="place-property-container">
      <div className="header">
        <ArrowLeft onClick={() => navigate(-1)} size={40} color="black" />
        <h2>Place Your Property For Rent</h2>
      </div>

      <form
        onSubmit={step === 1 ? handleNextStep : handleSubmit}
        className="property-form"
      >
        {step === 1 && (
          <>
            <div className="form-group">
              <label htmlFor="property-owner-name">Property Owner Name:</label>
              <input
                type="text"
                id="property-owner-name"
                value={ownersName}
                onChange={(e) => setOwnersName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-owner-phone">
                Property Owner Number:
              </label>
              <input
                type="number"
                id="property-owner-phone"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-name">Property Name:</label>
              <input
                type="text"
                id="property-name"
                value={propertysName}
                onChange={(e) => setPropertysName(e.target.value)}
                placeholder="Enter property name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-location">Location:</label>
              <input
                type="text"
                id="property-location"
                value={propertysLocation}
                onChange={(e) => setPropertysLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-price">Price (₦):</label>
              <input
                type="number"
                id="property-price"
                value={propertysPrice}
                onChange={(e) => setPropertysPrice(e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="property-description">Description:</label>
              <textarea
                id="property-description"
                value={propertysDescription}
                onChange={(e) => setPropertysDescription(e.target.value)}
                placeholder="Describe the property"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="property-type">Property Type:</label>
              <select
                id="property-type"
                value={propertysType}
                onChange={(e) => setPropertysType(e.target.value)}
                required
              >
                <option value="">Select property type</option>
                <option value="hall">Hall</option>
                <option value="meeting-room">Meeting Room</option>
                <option value="storage-space">Storage Space</option>
                <option value="shop">Shop</option>
              </select>
            </div>

            {/* New Feature: Number of Toilets */}
            <div className="form-group">
              <label htmlFor="toilets">Number of Toilets:</label>
              <input
                type="number"
                id="toilets"
                value={toilets}
                onChange={(e) => setToilets(e.target.value)}
                placeholder="Enter number of toilets"
                required
              />
            </div>

            {/* New Feature: Number of Parking Lots */}
            <div className="form-group">
              <label htmlFor="parking-lots">Number of Parking Lots:</label>
              <input
                type="number"
                id="parking-lots"
                value={parkingLots}
                onChange={(e) => setParkingLots(e.target.value)}
                placeholder="Enter number of parking lots"
                required
              />
            </div>

            <button
              type="submit"
              onClick={handleNextStep}
              className="submit-button"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group image-upload-section">
              <label htmlFor="property-images">
                Upload Images (at least 3):
              </label>
              <input
                type="file"
                id="property-images"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
                required
              />
              <div className="image-preview">
                {images.length > 0 &&
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`property-img-${index}`}
                      className="preview-image"
                    />
                  ))}
              </div>
            </div>

            <button type="submit" className="submit-button">
              Place Property
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default PlaceProperty;
