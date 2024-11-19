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
import { DeleteProperty, GetAllUsers } from "../../Features/zonefySlice";
import { baseURL } from "../../Features/utils";
import Propertyimg from "../../assets/no-photo.jpg";

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
  const { propertyData, allUsers } = useAppSelector(selectZonefy);
  const [properties, setProperties] = useState(propertyData?.data ?? []);
  const [users, setUsers] = useState(allUsers?.data ?? []);

  // useEffect(() => {
  //   setProperties(propertyData);
  // }, [propertyData]);

  useEffect(() => {
    dispatch(GetAllUsers(1));
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
        data: [properties.length, users.length],
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

  const handleApprove = (id) => {
    const updatedProperties = properties.map((property) =>
      property.id === id ? { ...property, status: "Approved" } : property
    );
    setProperties(updatedProperties);
  };

  const handleReject = (id) => {
    dispatch(DeleteProperty(id));
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

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

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-statistics">
        <canvas id="admin-chart"></canvas>
      </div>

      <div className="section">
        <h2>Manage Properties</h2>
        <div className="properties-list">
          {properties?.length > 0 &&
            properties?.map((property, index) => (
              <div className="property-card" key={index}>
                <img
                  src={
                    imageUrls
                      ? imageUrls[property?.propertyImageUrl[0]] // `https://drive.google.com/thumbnail?id=${property?.propertyImageUrl[0]}&sz=1000`
                      : Propertyimg
                  }
                  alt={property?.propertyName}
                  className="property-image"
                />
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p>Location: {property?.propertyLocation}</p>
                  <p>Owner: {property?.ownerName}</p>
                </div>
                <div className="property-actions">
                  <button
                    className="reject-button"
                    onClick={() => handleReject(property.id)}
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* <div className="section">
        <h2>Manage Users</h2>
        <div className="users-list">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Status: {user.status}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* <div className="section">
        <h2>Rental Requests</h2>
        <div className="requests-list">
          {requests.map((request) => (
            <div className="request-card" key={request.id}>
              <h3>{request.property}</h3>
              <p>User: {request.user}</p>
              <p>Status: {request.status}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}

export default AdminDashboard;
