import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import {
  selectZonefy,
  useAppDispatch,
  useAppSelector,
} from "../../../Store/store";
import { SignIn } from "../../../Features/zonefySlice";

function Signin() {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(selectZonefy);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const payload = {
    email: email,
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
