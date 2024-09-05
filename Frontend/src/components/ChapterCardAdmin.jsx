import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner for loading indicator
import { deleteChapter, API_URL } from "../api/auth";

function ChapterCard({ chapterTitle, chapterId, image }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSeeLessonsClick = () => {
    navigate(`chapters/${chapterId}`);
  };

  const handleDeletion = async () => {
    setLoading(true);
    try {
      await deleteChapter(chapterId);
      window.location.reload();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Reset loading state once done
    }
  };

  return (
    <Card style={{ margin: "20px", maxWidth: "600px", padding: "10px" }}>
      {image ? (
        <Card.Img
          variant="top"
          src={`${API_URL}/images/${image}`}
          alt="sorry picture was not loaded successfully"
        />
      ) : (
        <></>
      )}
      <Card.Body>
        <Card.Title style={{ marginBottom: "20px" }}>{chapterTitle}</Card.Title>
        <div
          className="container-fluid"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Button
            variant="success"
            onClick={handleSeeLessonsClick}
            style={{ marginRight: "15px" }}
          >
            الدروس
          </Button>
          <Button
            variant="danger"
            onClick={handleDeletion}
            style={{ margin: "15px" }}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                حذف...
              </>
            ) : (
              "حذف"
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChapterCard;
