import React, { useEffect, useState } from "react";
import "./listedprop.css";
import { useNavigate } from "react-router-dom";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import { GetAllProperty } from "../../Features/zonefySlice";

function ListedProperties() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const { propertyData } = useAppSelector(selectZonefy);

  useEffect(() => {
    // Fetch properties based on page number
    dispatch(GetAllProperty(pageNumber));
    // Set page number based on total pages
    setPageNumber(propertyData?.totalPages || 1);
  }, [dispatch, pageNumber]);

  const handleNextPage = () => {
    if (pageNumber < propertyData?.totalPages) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="listedProperties">
      <p className="title">Latest Listed Properties</p>
      <div className="rectangle-container">
        {propertyData?.data &&
        Array.isArray(propertyData.data) &&
        propertyData.data.length > 0 ? (
          propertyData.data.map((property, index) => {
            // const imageUrl = imageUrls[property?.propertyImageUrl[0]];
            return (
              <div className="rectangle" key={index}>
                <p className="header-text">{property.propertyName}</p>
                <img
                  style={{ width: "100%" }}
                  src={
                    property?.propertyImageUrl[0] //`https://drive.google.com/uc?id=${property.propertyImageUrl[0]}&export=media` //`https://drive.google.com/thumbnail?id=${property.propertyImageUrl[0]}`
                  }
                  alt={property.propertyName}
                  className="logo-image1"
                />
                <div className="details-container">
                  <span className="description">
                    {property.propertyDescription}
                  </span>
                  <div className="property-info">
                    <span className="location">
                      {property.propertyLocation}
                    </span>
                    <span className="price">
                      ₦{property.propertyPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="property-features">
                    <span className="toilet">
                      🚻 {property.toiletNumber} toilets
                    </span>
                    <span className="parking">
                      🚗 {property.parkingLot} parking lots
                    </span>
                    <button
                      className="rent-button"
                      onClick={() =>
                        navigate("/details", { state: { property } })
                      }
                    >
                      Click to rent
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-properties-message">No properties available.</p>
        )}
      </div>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
          Previous
        </button>
        <span>
          Page {pageNumber} of {propertyData?.totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={pageNumber >= (propertyData?.totalPages || 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ListedProperties;
