import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/auth";
import "./ChapterCard.css";

function ChapterCard({ chapter }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSeeLessonsClick = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(`chapters/${chapter.id}`);
      setLoading(false);
    }, 100);
  };

  return (
    <Card className="chapter-card">
      {chapter.image && (
        <Card.Img variant="top" src={`${API_URL}/images/${chapter.image}`} />
      )}
      <Card.Body>
        <Card.Title className="chapter-title">{chapter.name}</Card.Title>
        <Button
          variant="success"
          onClick={handleSeeLessonsClick}
          disabled={loading}
          className="see-lessons-button"
        >
          {loading ? "Loading..." : "See Lessons"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ChapterCard;
