import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { notification, message } from "antd";
import "./placeproperty.css";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import {
  PlaceHouse,
  setNotifyMessage,
  UploadImage,
} from "../../Features/zonefySlice";

function PlaceProperty() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData, notifyMessage, propertyData } =
    useAppSelector(selectZonefy);

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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [guests, setGuests] = useState("");
  const [postCodes, setPostCode] = useState("");

  // console.log("Property Data:", propertyData);

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
    guests: guests || 0,
    dimension: dimensions || 0,
    checkInTime: checkIn,
    checkOutTime: checkOut,
    toiletNumber: toilets,
    parkingLot: parkingLots,
    postCode: postCodes,
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    dispatch(PlaceHouse(payload));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length > 0) {
      const formData = new FormData();

      images.forEach((file) => {
        formData.append("files", file);
      });

      const propertyId = localStorage.getItem("propertyId");

      dispatch(UploadImage(formData, propertyId));
      // .then(() => {
      //   message.success("Images uploaded successfully!");
      // })
      // .catch((error) => {
      //   message.error("Failed to upload images. Please try again.");
      //   console.error("Upload error:", error);
      // });
    } else {
      message.error("Please select at least one image to upload.");
    }
  };

  useEffect(() => {
    if (window.location.pathname === "/place-property") {
      if (notifyMessage?.isSuccess === true) {
        setStep(2);

        const response = { ...notifyMessage };
        delete response.isSuccess;
        notification.success(response);
        dispatch(setNotifyMessage(null));
        navigate("/home");
      } else if (notifyMessage?.isSuccess === false && notifyMessage?.message) {
        const response = { ...notifyMessage };
        delete response.isSuccess;
        notification.error(response);
        dispatch(setNotifyMessage(null));
      }
    }
  }, [dispatch, notifyMessage]);

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
              <label htmlFor="property-location">Post Code:</label>
              <input
                type="text"
                id="property-location"
                value={postCodes}
                onChange={(e) => setPostCode(e.target.value)}
                placeholder="Enter your postcode"
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

            <div className="form-group">
              <label htmlFor="checkIn">Check In:</label>
              <input
                type="datetime-local"
                id="checkIn"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="When are placing out the property"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkOut">Check Out:</label>
              <input
                type="datetime-local"
                id="toilets"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="Till When"
                required
              />
            </div>

            {["hall", "meeting-room"].includes(propertysType) && (
              <div className="form-group">
                <label htmlFor="guests">
                  How many guests can be accommodated:
                </label>
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

            {["storage-space", "shop"].includes(propertysType) && (
              <div className="form-group">
                <label htmlFor="dimensions">
                  What Dimensions does your space have:
                </label>
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

            <button type="submit" className="submit-button">
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
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Place Property & Image
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default PlaceProperty;
