import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Property from "../../assets/Property2.jpg";
import "./Myproperties.css";
import { useNavigate } from "react-router-dom";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import { GetAllProperty, DeleteProperty } from "../../Features/zonefySlice";

function Myproperty() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { propertyData } = useAppSelector(selectZonefy);

  useEffect(() => {
    setPageNumber(propertyData?.totalPages || 1);
  }, [dispatch, propertyData]);

  useEffect(() => {
    dispatch(GetAllProperty(pageNumber));
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

  const handleDeleteConfirm = (id) => {
    setSelectedPropertyId(id);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedPropertyId) {
      await dispatch(DeleteProperty(selectedPropertyId));
      setIsModalVisible(false);
      setSelectedPropertyId(null);
      dispatch(GetAllProperty(pageNumber));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPropertyId(null);
  };

  return (
    <div className="listedProperties">
      <button onClick={() => navigate(-1)} className="backs-button">
        Go Back
      </button>

      <p className="title">My Properties</p>

      {/* Display properties */}
      <div className="rectangle-container">
        {propertyData?.data &&
        Array.isArray(propertyData.data) &&
        propertyData.data.length > 0 ? (
          propertyData.data.map((property) => (
            <div className="rectangle" key={property.id}>
              <p className="header-text">{property.propertyName}</p>
              <img
                src={
                  property.propertyImageUrl && property.propertyImageUrl.length
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
                    onClick={() =>
                      navigate("/details", { state: { property } })
                    }
                  >
                    Click to view
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteConfirm(property.id)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this property?</p>
      </Modal>
    </div>
  );
}

export default Myproperty;
