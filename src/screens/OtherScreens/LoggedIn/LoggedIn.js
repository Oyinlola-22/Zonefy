import React, { useState, useEffect } from "react";
import { ChatCircleDots, House, List, SignOut, X } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import "./loggedin.css";
import Property from "../../../assets/zonefy.jpg";
import ListedProperties from "../../../components/ListedProps/ListedProperties";
import SearchResults from "../../../components/SearchResults/SearchResults";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../../Store/store";
import { setLogout, setNotifyMessage } from "../../../Features/zonefySlice";
import { notification } from "antd";

function LoggedIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifyMessage } = useAppSelector(selectZonefy);

  // State to track sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Sidebar toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to show the logout confirmation modal
  const handleLogoutClick = () => {
    setIsSidebarOpen(false); // Close the sidebar
    setShowModal(true); // Show the modal
  };

  // Function to confirm logout and navigate to home page
  const confirmLogout = () => {
    setShowModal(false);
    dispatch(setLogout());
    navigate("/");
  };

  // Function to cancel the logout process
  const cancelLogout = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (window.location.pathname === "/home") {
      if (notifyMessage?.isSuccess === true) {
        var response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.success(response);
        dispatch(setNotifyMessage(null));
      }
    }
  }, [dispatch, notifyMessage]);

  return (
    <div className={`body ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="fixed-header">
        <div className="left-section">
          {isSidebarOpen ? (
            <X size={40} color="#f2f2f2" onClick={toggleSidebar} />
          ) : (
            <List size={40} color="#f2f2f2" onClick={toggleSidebar} />
          )}
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/place-property" style={{ color: "white" }}>
              Place a Property
            </Link>
          </span>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="sidebar">
          <nav>
            <ul>
              <li>
                <ChatCircleDots weight="bold" size={30} />
                <Link to="/messages">Messages</Link>
              </li>
              <li>
                <House weight="bold" size={30} />
                <Link to="/property">Properties</Link>
              </li>
              <li>
                <SignOut weight="bold" size={30} />
                <span onClick={handleLogoutClick}>Logout</span>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <div className="main-content">
        <div className="image-container">
          <img src={Property} alt="Property" className="logo-image" />
          <div className="image-text">SEARCH THROUGH FOR YOUR TASTE</div>
        </div>
        {/* Always display the SearchResults */}
        <SearchResults />

        <ListedProperties />
      </div>

      {/* Modal for Logout Confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={confirmLogout}>
                Yes, Log Out
              </button>
              <button className="cancel-button" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoggedIn;
