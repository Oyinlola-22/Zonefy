import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./adminDashboard.css";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../Store/store";
import {
  AdminGetUserByNumberOrEmail,
  AdminGetPropByName,
  AdminBlockProperty,
  AdminBlockUser,
  DeleteProperty,
  GetAllUsers,
} from "../../Features/zonefySlice";
import { baseURL } from "../../Features/utils";
import Propertyimg from "../../assets/no-photo.jpg";
import { Modal } from "antd";
import AdminChat from "./AdminChat";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { propertyData, allUsers, searchResults, userResults } =
    useAppSelector(selectZonefy);
  const [properties, setProperties] = useState(propertyData?.data ?? []);
  const [users, setUsers] = useState(allUsers?.data ?? []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBlockVisible, setIsBlockVisible] = useState(false);
  const [isBlockUserVisible, setIsBlockUserVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertySearch, setPropertySearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [showChat, setShowChat] = useState(false);
  const [blockState, setBlockState] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageSize = 30;

  // useEffect(() => {
  //   dispatch(AdminGetUserByNumberOrEmail(userSearch));
  // }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProperty(null);
  };

  const handleCancels = () => {
    setIsBlockVisible(false);
    setSelectedProperty(null);
  };

  const handleClose = () => {
    setIsBlockUserVisible(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    dispatch(GetAllUsers(currentPage, pageSize));
  }, []);

  useEffect(() => {
    setUsers(allUsers?.data);
  }, [allUsers]);

  const chartRef = useRef(null);

  const data = {
    labels: ["Properties", "Users"],
    datasets: [
      {
        label: "Admin Dashboard Overview",
        data: [properties?.length, users?.length],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("admin-chart").getContext("2d");
    chartRef.current = new ChartJS(ctx, {
      type: "bar",
      data: data,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [properties, users]);

  /* PLEASE DON'T ENTER HERE, THERE IS RADIOACTIVE GAS */
  const [imageUrls, setImageUrls] = useState({});

  // Fetch file from the backend and get the image URL
  async function fetchFile(fileId) {
    try {
      // var token = localStorage.getItem()
      const response = await fetch(`${baseURL}HouseProperty/Files/${fileId}`, {
        // headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url; // Return the URL for the image
      } else {
        console.error("Failed to fetch file:", await response.json());
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  }

  // Fetch image URLs for all data when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      const urls = {};
      if (properties?.length > 0) {
        for (const data of properties) {
          if (data?.propertyImageUrl.length > 0) {
            const fileId = data?.propertyImageUrl[0];
            const imageUrl = await fetchFile(fileId);
            if (imageUrl) {
              urls[fileId] = imageUrl;
            }
          }
        }
        setImageUrls(urls); // Store the URLs in state
      }
    };

    fetchImages();
  }, [properties]); // Re-fetch if `allDatas` or `token` change

  // Filter properties based on search input
  useEffect(() => {
    setFilteredProperties(
      properties.filter((property) =>
        property.propertyName
          .toLowerCase()
          .includes(propertySearch.toLowerCase())
      )
    );
  }, [propertySearch, properties]);

  const handleNav = () => {
    setShowChat(showChat);
    navigate("/admin-chat");
  };

  const toggleBlockState = (type, entity) => {
    if (type === "user") {
      dispatch(
        AdminBlockUser({
          email: entity.email,
          blockState: !entity.isBlocked,
        })
      );
      // Optimistically update the users list in UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === entity.id
            ? { ...user, isBlocked: !entity.isBlocked }
            : user
        )
      );
    } else if (type === "property") {
      dispatch(
        AdminBlockProperty({
          email: entity.creatorEmail,
          propId: entity.id,
          blockState: !entity.isBlocked,
        })
      );
      // Optimistically update the properties list in UI
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === entity.id
            ? { ...property, isBlocked: !entity.isBlocked }
            : property
        )
      );
    }
  };

  const handleBlockUnblockUser = (user) => {
    toggleBlockState("user", user);
    setIsBlockUserVisible(false); // Close modal
  };

  const handleBlockUnblockProperty = (property) => {
    toggleBlockState("property", property);
    setIsBlockVisible(false); // Close modal
  };

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setFilteredProperties(searchResults); // Use the search results directly
    } else {
      // If no results, show all properties
      setFilteredProperties(properties);
    }
  }, [searchResults, properties]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          user.phoneNumber.toLowerCase().includes(userSearch.toLowerCase())
      )
    );
  }, [userSearch, users]);

  // Calculate paginated users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="toggle-section">
        <button onClick={handleNav}>Open Chat</button>
      </div>
      <div className="admin-dashboard">
        {/* Rest of the AdminDashboard content */}
        <div className="admin-statistics">
          <canvas id="admin-chart"></canvas>
        </div>
        <div className="section">
          <h2>Manage Properties</h2>
          <div className="search-containers">
            <input
              type="text"
              placeholder="Search properties by name..."
              value={propertySearch}
              onChange={(e) => setPropertySearch(e.target.value)}
              className="search-bar"
            />
            <button
              className="search-buttons"
              onClick={() => dispatch(AdminGetPropByName(propertySearch))}
            >
              Search
            </button>
          </div>
          <div className="properties-list">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <div className="property-card" key={property.id}>
                  <img
                    src={
                      imageUrls // Assuming this is how you're handling image URLs
                        ? property?.propertyImageUrl[0]
                        : Propertyimg
                    }
                    alt={property?.propertyName}
                    className="property-image"
                  />
                  <div className="property-info">
                    <h3>{property.propertyName}</h3>
                    <p>Location: {property?.propertyLocation}</p>
                    <p>Owner: {property?.ownerName}</p>
                    <p>Status: {property?.isBlocked ? "Blocked" : "Active"}</p>
                  </div>
                  <div className="property-actions">
                    <button
                      className="reject-button"
                      onClick={() => {
                        setIsModalVisible(true);
                        setSelectedPropertyId(property.id);
                      }}
                    >
                      Delete Property
                    </button>

                    <button
                      className="reject-button"
                      onClick={() => {
                        setIsBlockVisible(true);
                        setSelectedProperty(property);
                      }}
                    >
                      Block Property
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties found matching your search.</p>
            )}
          </div>
        </div>

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

        <Modal
          title={
            selectedProperty?.isBlocked ? "Unblock Property" : "Block Property"
          }
          open={isBlockVisible}
          onOk={() => handleBlockUnblockProperty(selectedProperty)}
          onCancel={() => setIsBlockVisible(false)}
          okText={selectedProperty?.isBlocked ? "Unblock" : "Block"}
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to{" "}
            {selectedProperty?.isBlocked ? "unblock" : "block"} this property?
          </p>
        </Modal>

        <div className="section">
          <h2>Manage Users</h2>
          <input
            type="text"
            placeholder="Search users by Phone Number..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="search-bar"
          />
          <button
            className="search-buttons"
            onClick={() => dispatch(AdminGetUserByNumberOrEmail(userSearch))}
          >
            Search
          </button>

          {userSearch.trim() && paginatedUsers?.length > 0 && (
            <div className="section">
              <h2>Search Results</h2>
              <div className="users-list">
                {filteredUsers.map((user) => (
                  <div className="user-card" key={user.id}>
                    <h3>Email: {user.email}</h3>
                    <p>Phone Number: {user.phoneNumber}</p>
                    <p>Email Verified: {user.isEmailVerified ? "Yes" : "No"}</p>
                    <p>Account Blocked: {user.isBlocked ? "Yes" : "No"}</p>
                    <p>
                      Created At: {new Date(user.createdAt).toLocaleString()}
                    </p>

                    <button
                      className="delete-button"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsBlockUserVisible(true); // Show modal to confirm block/unblock
                      }}
                    >
                      {user.isBlocked ? "Unblock User" : "Block User"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {userSearch.trim() && paginatedUsers?.length === 0 && (
            <div className="section">
              <h2>Search Results</h2>
              <p>No results found. Try a different search.</p>
            </div>
          )}

          <div className="users-list">
            {filteredUsers.map((user) => (
              <div className="user-card" key={user.id}>
                <h3>Phone Number: {user.phoneNumber}</h3>
                <p>Email: {user.email}</p>
                <p>Status: {user.isBlocked ? "Blocked" : "Active"}</p>
                <p>Email Verified: {user.isEmailVerified ? "Yes" : "No"}</p>
                <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                <button
                  className="delete-button"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsBlockUserVisible(true); // Show modal to confirm block/unblock
                  }}
                >
                  {user.isBlocked ? "Unblock User" : "Block User"}
                </button>
              </div>
            ))}
          </div>

          <Modal
            title={selectedUser?.isBlocked ? "Unblock User" : "Block User"}
            open={isBlockUserVisible}
            onOk={() => handleBlockUnblockUser(selectedUser)}
            onCancel={() => setIsBlockUserVisible(false)}
            okText={selectedUser?.isBlocked ? "Unblock" : "Block"}
            cancelText="Cancel"
          >
            <p>
              Are you sure you want to{" "}
              {selectedUser?.isBlocked ? "unblock" : "block"} this user?
            </p>
          </Modal>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
