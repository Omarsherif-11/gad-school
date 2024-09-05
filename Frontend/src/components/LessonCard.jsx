import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { deleteLesson } from "../api/auth";
import { useState } from "react";

import { API_URL } from "../api/auth";

function LessonCard(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function viewContent() {
    navigate(`lessons/${props.id}`);
  }

  async function handleDeletion() {
    try {
      setLoading(true);
      await deleteLesson(props.id);
      window.location.reload();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card style={{ margin: "20px", maxWidth: "600px", padding: "10px" }}>
        <Card.Img
          variant="top"
          src={`${API_URL}/images/${props.image}`}
          alt="no"
        />
        <Card.Body>
          <Card.Title style={{ marginBottom: "20px" }}>{props.name}</Card.Title>
          <div
            className="container-fluid"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Card.Text>{props.brief}</Card.Text>
            <Card.Text>{`تمت مشاهدته ${props.view_count} مرة`}</Card.Text>
            <Card.Text>{props.price + " EGP"}</Card.Text>
            <Button
              variant="success"
              style={{ margin: "15px" }}
              onClick={viewContent}
            >
              المحتوى
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletion}
              disabled={loading}
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
    </>
  );
}

export default LessonCard;
