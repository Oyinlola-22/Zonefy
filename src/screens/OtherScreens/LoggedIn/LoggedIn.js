import React, { useState, useEffect } from "react";
import {
  ChatCircleDots,
  House,
  List,
  SignOut,
  X,
  UserCircle,
} from "@phosphor-icons/react";
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
  const { notifyMessage, userData } = useAppSelector(selectZonefy);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogoutClick = () => {
    setIsSidebarOpen(false);
    setShowModal(true);
  };

  const confirmLogout = () => {
    setShowModal(false);
    dispatch(setLogout());
    navigate("/");
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (window.location.pathname === "/home") {
      if (notifyMessage?.isSuccess === true) {
        let response = { ...notifyMessage };
        delete response.isSuccess;
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
            <List
              size={40}
              color="#f2f2f2"
              onClick={toggleSidebar}
              style={{ cursor: "pointer" }}
            />
          )}
          <h2 style={{ cursor: "pointer" }}>Zonefy</h2>
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
              {![
                "adeyemi.adenipekun@outlook.com",
                "nifemiojinni22@gmail.com",
                "archraphr@gmail.com",
              ].includes(userData.email) && (
                <li>
                  <UserCircle weight="bold" size={30} />
                  <Link to="/message-admin">Message Admin</Link>
                </li>
              )}
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

        <SearchResults />
        <ListedProperties />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={confirmLogout}>
                Confirm
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
