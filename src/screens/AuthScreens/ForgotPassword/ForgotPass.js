import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../../Store/store";
import {
  Forgotpassword,
  setNotifyMessage,
} from "../../../Features/zonefySlice";
import { notification } from "antd";
import { Spinner } from "@phosphor-icons/react";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notifyMessage, isLoading } = useAppSelector(selectZonefy);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(Forgotpassword(email));
  };

  useEffect(() => {
    if (window.location.pathname.includes("/forgotpassword")) {
      if (notifyMessage?.isSuccess === true) {
        var response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.success(response);
        dispatch(setNotifyMessage(null));
        // navigate(`/resetPassword/${formData.Email}`);
      } else if (notifyMessage?.isSuccess === false && notifyMessage?.message) {
        response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.error(response);
        dispatch(setNotifyMessage(null));
      }
    }
  }, [navigate, dispatch, notifyMessage]);

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/signin" style={{ color: "white" }}>
              Back to Previous Page
            </Link>
          </span>
        </div>
      </div>

      <form className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Input your email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Submit Email
          </button>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
