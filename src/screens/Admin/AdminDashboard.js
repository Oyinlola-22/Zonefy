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
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Luxury Apartment in Lagos",
      location: "Lekki, Lagos",
      owner: "John Doe",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      title: "Modern Office Space",
      location: "Victoria Island, Lagos",
      owner: "Jane Smith",
      image: "https://via.placeholder.com/300",
    },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Suspended",
    },
  ]);

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
    // const updatedProperties = properties.map((property) =>
    //   property.id === id ? { ...property, status: "Rejected" } : property
    // );
    // setProperties(updatedProperties);
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
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <img
                src={property.image}
                alt={property.title}
                className="property-image"
              />
              <div className="property-info">
                <h3>{property.title}</h3>
                <p>Location: {property.location}</p>
                <p>Owner: {property.owner}</p>
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
