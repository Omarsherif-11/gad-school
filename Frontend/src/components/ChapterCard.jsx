import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../api/auth";

function ChapterCard({ chapter }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log("chapter is", chapter);
  console.log("url is", API_URL);

  const handleSeeLessonsClick = () => {
    setLoading(true); // Set loading state to true when button is clicked
    setTimeout(() => {
      // Simulate an async action
      navigate(`chapters/${chapter.id}`);
      setLoading(false); // Reset loading state
    }, 500); // Adjust the timeout as needed
  };

  return (
    <Card style={{ margin: "20px", maxWidth: "600px", padding: "10px" }}>
      <Card.Img variant="top" src={`${API_URL}/images/${chapter.image}`} />
      <Card.Body>
        <Card.Title style={{ marginBottom: "20px" }}>{chapter.name}</Card.Title>
        <div
          className="container-fluid"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Button
            variant="success"
            onClick={handleSeeLessonsClick}
            disabled={loading} // Disable the button when loading
            style={{ marginRight: "15px" }}
          >
            {loading ? "Loading..." : "See Lessons"}{" "}
            {/* Show loading indicator */}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChapterCard;
