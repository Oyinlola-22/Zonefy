import React, { useState } from "react";
import { House } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/resetpassword");
  };

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <House size={40} color="#f2f2f2" weight="fill" />
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

      <form className="signin-form" onSubmit={handleSubmit}>
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

        <button type="submit" className="submit-btn">
          Submit Email
        </button>
      </form>
    </div>
  );
}

export default Signin;
