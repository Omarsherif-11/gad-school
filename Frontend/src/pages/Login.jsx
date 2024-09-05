import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { setUsername } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(email, password);
      const username = Cookies.get("username");
      setUsername(username);
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      setError(error || "Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">الدخول</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="الإيميل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="الباسورد"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "تسجيل الدخول"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <div className="signup-link">
          <p>ليس لديك حساب؟</p>
          <Link to="/signup" className="link">
            أنشئ واحدا الأن
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
