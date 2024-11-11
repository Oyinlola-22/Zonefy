import React, { useState } from "react";
import { useAppDispatch } from "../../../Store/store";
import { ResendVerifyEmail } from "../../../Features/zonefySlice";

function ResendEmail() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");

  return (
    <div className="body">
      <div className="fixed-header">
        <div className="left-section">
          <h2>Zonefy</h2>
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

        <button
          type="submit"
          className="submit-btn"
          onClick={(e) => {
            e.preventDefault();
            dispatch(ResendVerifyEmail(email));
          }}
        >
          Resend Email
        </button>
      </form>
    </div>
  );
}

export default ResendEmail;
