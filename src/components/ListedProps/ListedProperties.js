import React, { useEffect, useState } from "react";
import "./listedprop.css";
import Property from "../../assets/no-photo.jpg";
import { useNavigate } from "react-router-dom";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../Store/store";
import {
  fetchFile,
  GetAllProperty,
  setPropertyData,
} from "../../Features/zonefySlice";

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

  /* PLEASE DON'T ENTER HERE, THERE IS RADIOACTIVE GAS */
  // const [imageUrls, setImageUrls] = useState({});

  // // Fetch image URLs for all data when component mounts
  // useEffect(() => {
  //   const fetchImages = async () => {
  //     const urls = {};
  //     if (propertyData?.data.length > 0) {
  //       for (const data of propertyData.data) {
  //         if (data?.propertyImageUrl.length > 0) {
  //           const fileId = data?.propertyImageUrl[0];
  //           const imageUrl = await fetchFile(fileId);
  //           if (imageUrl) {
  //             urls[fileId] = imageUrl;
  //           }
  //         }
  //       }
  //       setImageUrls(urls); // Store the URLs in state
  //     }
  //   };

  //   fetchImages();
  // }, [propertyData]); // Re-fetch if `allDatas` or `token` change

  async function updatePropertyData(
    propertyData,
    fetchFile,
    dispatch,
    setPropertyData
  ) {
    const newPropertyData = [];

    for (const data of propertyData.data) {
      if (data?.propertyImageUrl?.length > 0) {
        const fileId = data.propertyImageUrl[0];
        const imageUrl = await fetchFile(fileId); // Fetch the new image URL

        if (imageUrl) {
          // Create a new array with the updated first image
          const updatedPropertyImageUrl = [
            imageUrl,
            ...data.propertyImageUrl.slice(1),
          ];

          // Create a new object with the updated propertyImageUrl
          const updatedData = {
            ...data,
            propertyImageUrl: updatedPropertyImageUrl,
          };

          newPropertyData.push(updatedData); // Add the updated object to the array
        } else {
          newPropertyData.push(data); // Keep the original data if imageUrl is not found
        }
      } else {
        newPropertyData.push(data); // Keep the original data if propertyImageUrl is empty or undefined
      }
    }

    // Dispatch the updated property data
    var newPropData = { ...propertyData, data: newPropertyData };
    console.log("first: ", newPropData);
    dispatch(setPropertyData(newPropData));
  }

  useEffect(() => {
    updatePropertyData(propertyData, fetchFile, dispatch, setPropertyData)
      .then(() => {
        console.log("Property data updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating property data:", err);
      });
  }, []);

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
                    property?.propertyImageUrl.length > 0 &&
                    property?.propertyImageUrl[0].includes("blob")
                      ? property?.propertyImageUrl[0] //`https://drive.google.com/uc?id=${property.propertyImageUrl[0]}&export=media` //`https://drive.google.com/thumbnail?id=${property.propertyImageUrl[0]}`
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
                    <span className="location">
                      {property.propertyLocation}
                    </span>
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
