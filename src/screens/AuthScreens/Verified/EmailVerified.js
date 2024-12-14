import React from "react";
import { Link } from "react-router-dom";
import "./emailVerified.css";

function EmailVerified() {
  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
        </div>
      </div>

      <div className="email-verified-container">
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been successfully verified. You can now sign in.</p>
        <Link to="/signin" className="signin-link">
          <button className="signin-btn">Go to Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default EmailVerified;
