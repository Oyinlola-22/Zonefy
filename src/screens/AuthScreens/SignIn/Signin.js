import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./signin.css";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../../Store/store";
import {
  SignIn,
  VerifyEmail,
  setNotifyMessage,
} from "../../../Features/zonefySlice";
import { notification } from "antd";

function Signin() {
  const dispatch = useAppDispatch();
  const { userData, notifyMessage } = useAppSelector(selectZonefy);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Extract the email from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const qemail = queryParams.get("email");
  const qtoken = queryParams.get("token");
  // Decode the email if needed (remove extra quotes)
  const cleanedEmail = qemail ? qemail.replace(/['"]+/g, "") : "";
  console.log("query param: ", cleanedEmail);

  //we want to verify email
  useEffect(() => {
    if (cleanedEmail !== "" && qtoken.length > 16) {
      dispatch(VerifyEmail({ email: cleanedEmail, token: qtoken }));
    }
  }, [dispatch, qtoken, cleanedEmail]);

  const payload = {
    email: email,
    password: password,
  };

  useEffect(() => {
    if (userData) {
      navigate("/home");
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (window.location.pathname === "/signin") {
      if (notifyMessage?.isSuccess === true) {
        var response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.success(response);
        dispatch(setNotifyMessage(null));
      } else if (notifyMessage?.isSuccess === false && notifyMessage?.message) {
        var response = { ...notifyMessage };
        delete response.isSuccess;
        response = { ...response };
        notification.error(response);
        dispatch(setNotifyMessage(null));
        // if (response?.message === "Unverified email") {
        //   navigate(`/verifyEmail?showResend=true&email=${formData.Email}`);
        // }
      }
    }
  }, [dispatch, notifyMessage]);

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/signup" style={{ color: "white" }}>
              Back to Register
            </Link>
          </span>
        </div>
      </div>

      <form className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="forgotPass">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </p>

        <button
          type="submit"
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch(SignIn(payload));
          }}
        >
          Sign In
        </button>

        <br />

        <p className="dontHave">
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
