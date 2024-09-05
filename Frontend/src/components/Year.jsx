import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Year(props) {
  const navigate = useNavigate();
  const [nav, setNav] = useState(null);
  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    const role = Cookies.get("role");
    if (role === "admin") {
      setPrefix("admin/");
    } else {
      setPrefix("");
    }
  }, []);

  function handleClick(year) {
    setNav(year);
  }

  useEffect(() => {
    if (nav !== null) {
      navigate(`${prefix}year/${nav}`);
    }
  }, [nav, navigate, prefix]);

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <div className="card" style={{ maxWidth: "600px", margin: "10px", width: '400px' }}>
        <div className="card-body text-center">
          <h5
            className="card-title m-5"
            style={{
              fontFamily: "var(--font-primary), sans-serif",
              fontWeight: "bold",
              direction: "rtl",
              fontSize: "1.7rem",
            }}
          >
            {props.name}
          </h5>
          <button
            className="btn btn-lg btn-success"
            onClick={() => handleClick(props.Year)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default Year;
