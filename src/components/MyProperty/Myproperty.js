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
import {
  GetPersonalProperty,
  DeleteProperty,
} from "../../Features/zonefySlice";
import { MessageOutlined } from "@ant-design/icons";
import { ChatCircle } from "@phosphor-icons/react";

function Myproperty() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { myPropertyData, userData } = useAppSelector(selectZonefy);
  const [localPropertyData, setLocalPropertyData] = useState(
    myPropertyData?.data || []
  );

  const payload = {
    email: userData.email,
    pageNumber: pageNumber,
  };

  useEffect(() => {
    setPageNumber(myPropertyData?.totalPages || 1);
  }, [dispatch, myPropertyData]);

  useEffect(() => {
    dispatch(GetPersonalProperty(payload));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    setLocalPropertyData(myPropertyData?.data || []);
  }, [myPropertyData]);

  const handleNextPage = () => {
    if (pageNumber < myPropertyData?.totalPages) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
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

      <div className="rectangle-container">
        {localPropertyData.length > 0 ? (
          localPropertyData.map((property) => (
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
                    className="message-button"
                    onClick={() => {
                      // Navigate to a messaging component or open a chat modal
                      navigate("/messages", { state: { property } });
                    }}
                  >
                    <ChatCircle />
                    Messages
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => {
                      setIsModalVisible(true);
                      setSelectedPropertyId(property.id);
                    }}
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
          Page {pageNumber} of {myPropertyData?.totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={pageNumber >= (myPropertyData?.totalPages || 1)}
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={() => {
          dispatch(DeleteProperty(selectedPropertyId));
          handleCancel();
        }}
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
