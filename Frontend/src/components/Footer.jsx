import React from "react";
import { Container } from "react-bootstrap";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-container">
      <div
        className="d-flex flex-column align-items-center"
        style={{ marginTop: "20px" }}
      >
        <div className="mission-statement" style={{ fontSize: "1.6rem" }}>
          مهمتنا هى تقديم شرح بسيط على منصة بسيطة عشان نوصل لأبنائنا و إخوتنا
        </div>
        <hr className="footer-divider" />

        <div className="love-statement" style={{ fontSize: "1.6rem" }}>
          Developed with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/omar-sherif-747928262"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
            style={{ fontSize: "1.6rem" }}
          >
            Omar
          </a>{" "}
          &{" "}
          <a
            href="https://www.linkedin.com/in/abdelrahim-abdelazim-7219821a6/"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
            style={{ fontSize: "1.6rem" }}
          >
            Abdelrahim
          </a>
        </div>

        <div className="all-rights-reserved">
          &copy; {new Date().getFullYear()} All rights reserved. كل الحقوق
          محفوظة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
