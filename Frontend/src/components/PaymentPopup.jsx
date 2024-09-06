import React, { useState } from "react";
import "./PaymentPopup.css";

const PaymentPopup = ({ isOpen, onClose, handleBuy }) => {
  const [selectedOption, setSelectedOption] = useState("wallet");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  if (!isOpen) return null;

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === "wallet") {
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("popup")) {
      onClose();
    }
  };

  const handleOKButton = async () => {
    setIsLoading(true); // Set loading to true when button is clicked
    await handleBuy(selectedOption, inputValue);
    setIsLoading(false); // Reset loading to false after processing
  };

  return (
    <div className="popup" onClick={handleOutsideClick}>
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <div className="options">
          {/* <div
            className={`option-card ${
              selectedOption === "card" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("card")}
          >
            الدفع ببطاقة
          </div> */}
          <div
            className={`option-card ${
              selectedOption === "wallet" ? "selected" : ""
            }`}
            onClick={() => handleOptionClick("wallet")}
          >
            الدفع بمحفظة إلكترونية
          </div>
        </div>
        {selectedOption === "wallet" && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="رقم المحمول"
          />
        )}
        <button
          className="submit-btn"
          onClick={handleOKButton}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "تحميل..." : "دفع"}{" "}
          {/* Show loading text or normal text */}
        </button>
      </div>
    </div>
  );
};

export default PaymentPopup;
