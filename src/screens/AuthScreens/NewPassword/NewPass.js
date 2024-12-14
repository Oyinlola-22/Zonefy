import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../Store/store";
import { ResetPasswords } from "../../../Features/zonefySlice";

function NewPassword() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

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
      const payload = {
        email: cleanedEmail,
        token: qtoken,
        newPassword: password,
        confirmNewPassword: password,
      };
      dispatch(ResetPasswords(payload));
    }
  }, [qtoken, cleanedEmail, dispatch]);

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     navigate("/forgotpassword");
  //   };

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
