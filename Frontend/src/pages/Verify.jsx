import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Verify.css"; // Import the CSS file
import { axiosInstance } from "../api/auth";
import Cookies from "js-cookie";

const Verify = () => {
  const { setUsername } = useTheme();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for verification button
  const email = localStorage.getItem("verificationEmail") || "";
  const navigate = useNavigate();
  console.log("email is:", email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true); // Set verifying state to true

    try {
      const response = await axiosInstance.post(
        `/verify`,
        { email, code },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const username = Cookies.get("username");
        setUsername(username);
        localStorage.removeItem("verificationEmail");
        navigate("/");
      } else {
        setError(
          response.data.message || "An error occurred during verification."
        );
      }
    } catch (err) {
      console.log("err is", err);
      setError(err.response?.data || "An error occurred during verification.");
    } finally {
      setIsVerifying(false); // Reset verifying state
    }
  };

  const handleResend = async () => {
    setIsSending(true);
    setError("");

    try {
      const response = await axiosInstance.post(`/resend-verification-code`, {
        email,
      });
      console.log(response);
      if (response.status === 200) {
        alert("Verification code resent successfully!");
      } else {
        setError("Failed to resend verification code. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while resending the verification code.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Enter Verification Code</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="input"
          />
          <button
            type="submit"
            className="button"
            disabled={isVerifying} // Disable button during verification
          >
            {isVerifying ? (
              <>
                <span className="spinner"></span>{" "}
                {/* Spinner for loading state */} تأكيد
              </>
            ) : (
              "تأكيد"
            )}
          </button>
          <div className="resend" onClick={handleResend}>
            <p>{isSending ? "جار الإرسال..." : "إعادة الإرسال؟"}</p>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Verify;
