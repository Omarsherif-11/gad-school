import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { logoutService } from "../api/auth";
import Cookies from "js-cookie";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme, username, setUsername } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setUsername]);

  const handleLogout = async () => {
    // Implement the actual logout function
    await logoutService();
    Cookies.remove("username");
    Cookies.remove("role");
    Cookies.remove("mode");
    Cookies.remove("jwt");
    Cookies.remove("email");
    setUsername(null);
    navigate("login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="nav-container">
      <div className="brand">
        <Link to="/">Gad School</Link>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`nav-list ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
        <li className="nav-item">
          <button
            className="btn btn-lg btn-success"
            onClick={() => navigate("/")}
          >
            الرئيسية
          </button>
        </li>
        <li className="nav-item">
          <div
            className={`theme-switch ${theme === "dark" ? "dark-mode" : ""}`}
            onClick={toggleTheme}
          >
            <FaSun
              className={`icon sun-icon ${
                theme === "dark" ? "hidden" : "visible"
              }`}
            />
            <FaMoon
              className={`icon moon-icon ${
                theme === "dark" ? "visible" : "hidden"
              }`}
            />
          </div>
        </li>
        <div className="nav-actions">
          {!username ? (
            <>
              <li className="nav-item">
                <Link to="/login">تسجيل الدخول</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup">إنشاء حساب</Link>
              </li>
            </>
          ) : (
            <>
              <span className="nav-welcome">Welcome, {username}</span>
              <button className="btn btn-lg btn-success" onClick={handleLogout}>
                تسجيل الخروج
              </button>
            </>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
