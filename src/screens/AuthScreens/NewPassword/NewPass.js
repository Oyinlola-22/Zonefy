import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../../Store/store";
import {
  ResetPasswords,
  setNotifyMessage,
} from "../../../Features/zonefySlice";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { Eye, Spinner } from "@phosphor-icons/react";

function NewPassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { notifyMessage, isLoading } = useAppSelector(selectZonefy);
  const [showPassword, setShowPassword] = useState(false);

  // Extract the email from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const qemail = queryParams.get("email");
  const qtoken = queryParams.get("token");
  // Decode the email if needed (remove extra quotes)
  const cleanedEmail = qemail ? qemail.replace(/['"]+/g, "") : "";
  // console.log("query param: ", cleanedEmail);

  //we want to verify email
  // useEffect(() => {
  //   if (cleanedEmail !== "" && qtoken.length > 16) {
  //     const payload = {
  //       email: cleanedEmail,
  //       token: qtoken,
  //       newPassword: password,
  //       confirmNewPassword: password,
  //     };
  //     dispatch(ResetPasswords(payload));
  //   }
  // }, [qtoken, cleanedEmail, dispatch]);

  const payload = {
    email: cleanedEmail,
    token: qtoken,
    newPassword: newPassword,
    confirmNewPassword: password,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(ResetPasswords(payload));
  };

  useEffect(() => {
    if (window.location.pathname.includes("/resetpassword")) {
      if (notifyMessage?.isSuccess === true) {
        var response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.success(response);
        dispatch(setNotifyMessage(null));
        navigate("/signin");
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
            <Link to="/forgotpassword" style={{ color: "white" }}>
              Back
            </Link>
          </span>
        </div>
      </div>

      {/* onSubmit={handleSubmit} */}

      <form className="signin-form">
        <div className="form-group">
          <label htmlFor="code">Input new Password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="code"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
            <Eye
              className="eye-icon"
              color="grey"
              size={25}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Input new password</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {isLoading ? (
          <Spinner size={50} className="submit-btn" />
        ) : (
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Reset Password
          </button>
        )}
      </form>
    </div>
  );
}

export default NewPassword;
