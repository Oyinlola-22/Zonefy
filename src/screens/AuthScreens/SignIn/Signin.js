import React, { useState } from "react";
import { House } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import "./signin.css";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <House size={40} color="#f2f2f2" weight="fill" />
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

        <button type="submit" className="submit-btn">
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
