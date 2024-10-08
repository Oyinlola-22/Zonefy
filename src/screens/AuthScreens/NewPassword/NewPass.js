import React, { useState } from "react";
import { House } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";

function NewPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     navigate("/forgotpassword");
  //   };

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <House size={40} color="#f2f2f2" weight="fill" />
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
          <label htmlFor="code">Input OTP</label>
          <input
            type="number"
            id="code"
            placeholder="Enter the code you received in your mail"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Input new password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default NewPassword;
