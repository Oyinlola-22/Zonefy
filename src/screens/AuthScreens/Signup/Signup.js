import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
  selectZonefy,
} from "../../../Store/store";
import { SignUp } from "../../../Features/zonefySlice";

function Signup() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(selectZonefy);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const payload = {
    email: email,
    phoneNumber: phoneNumber,
    password: password,
  };

  useEffect(() => {
    if (userData) {
      navigate("/home");
    }
  }, [userData, navigate]);

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
        </div>
        <div className="right-section">
          <span className="text1">
            <Link to="/" style={{ color: "white" }}>
              Back
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="number"
            id="phoneNumber"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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

        <button
          type="submit"
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch(SignUp(payload));
          }}
        >
          Sign Up
        </button>

        <p className="dontHave">
          Have an account already? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
