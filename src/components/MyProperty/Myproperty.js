import React, { useEffect, useState } from "react";
import Property from "../../assets/Property2.jpg";
import "./Myproperties.css";
import { useNavigate } from "react-router-dom";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import { GetAllProperty, setPropertyData } from "../../Features/zonefySlice";

function Myproperty() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const { propertyData } = useAppSelector(selectZonefy); // updated to fetch propertyData

  useEffect(() => {
    dispatch(GetAllProperty(pageNumber));
  }, [dispatch, pageNumber]);

  const handleNextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleDelete = (id) => {
    // setPropertyData(propertyData.filter((property) => property.id !== id)); // Updated for deleting property from list
  };

  return (
    <div className="listedProperties">
      <button onClick={() => navigate(-1)} className="backs-button">
        Go Back
      </button>

      <p className="title">My Properties</p>

      {/* Display properties */}
      <div className="rectangle-container">
        {propertyData && propertyData.length ? (
          propertyData.map((property) => (
            <div className="rectangle" key={property.id}>
              <p className="header-text">{property.propertyName}</p>
              <img
                src={
                  property.propertyImageUrl.length
                    ? property.propertyImageUrl[0]
                    : Property
                }
                alt={property.propertyName}
                className="logo-image1"
              />
              <div className="details-container">
                <span className="description">
                  {property.propertyDescription}
                </span>
                <div className="property-info">
                  <span className="location">{property.propertyLocation}</span>
                  <span className="price">
                    ₦{property.propertyPrice.toLocaleString()}
                  </span>
                </div>
                <div className="property-features">
                  <span>🚻 {property.toiletNumber} toilets</span>
                  <span>🚗 {property.parkingLot} parking lots</span>
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={pageNumber === 1}>
          Previous
        </button>
        <span>Page {pageNumber}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default Myproperty;
