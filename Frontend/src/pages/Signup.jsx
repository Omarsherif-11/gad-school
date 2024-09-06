import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../api/auth";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 6) {
        setError("password should be at least 6 characters");
        return;
      }
      setIsLoading(true);
      await signUp(formData);

      setAlertMessage("Signup successful! Redirecting to verification code...");
      setShowAlert(true);
      localStorage.setItem("verificationEmail", formData.email);
      navigate("/verify");
    } catch (err) {
      console.log(err);
      setError(err || "An error occurred");
      if (err.includes("verify")) {
        localStorage.setItem("verificationEmail", formData.email);
        setTimeout(() => navigate("/verify"), 1000);
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="signup-title">إنشاء حساب</h1>
        {error && <p className="signup-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="الاسم الأول"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="الاسم الأخير"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            placeholder="الإيميل"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="text"
            name="phone"
            placeholder="رقم المحمول"
            value={formData.phone}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="باسوورد"
            value={formData.password}
            onChange={handleChange}
            required
            className="signup-input"
          />
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "إنشاء حساب"}
          </button>
        </form>
        <div className="login-link">
          <p>لديك حساب بالفعل؟</p>
          <Link to="/login" className="link">
            تسجبل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
