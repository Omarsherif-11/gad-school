import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentResult = () => {
  const location = useLocation();
  const [status, setStatus] = useState("Loading...");
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success") === "true";
    const errorOccured = queryParams.get("error_occured") === "true";
    const merchantOrderId = queryParams.get("merchant_order_id");

    if (merchantOrderId) {
      const theList = merchantOrderId.split("*");
      if (theList.length > 2) {
        const yearId = theList[1];
        const chapterId = theList[2];
        setRedirectUrl(`/year/${yearId}/chapters/${chapterId}`);
      }
    }

    if (success) {
      setStatus("Payment Successful");
    } else if (errorOccured) {
      setStatus("Payment Failed");
    } else {
      setStatus("Payment Status Unknown");
    }
  }, [location.search]);

  return (
    <div>
      <h1>{status}</h1>
      {status === "Payment Successful" && redirectUrl && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = redirectUrl)}
        >
          الذهاب للدروس
        </button>
      )}
    </div>
  );
};

export default PaymentResult;
