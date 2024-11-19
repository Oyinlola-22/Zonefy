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
                  src={`https://drive.google.com/thumbnail?id=${property?.propertyImageUrl[0]}&sz=1000`}
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
