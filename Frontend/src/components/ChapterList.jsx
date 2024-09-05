import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import ChapterCardAdmin from "../components/ChapterCardAdmin";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { UploadChapter } from "../api/auth";
import {Col, Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { axiosInstance } from "../api/auth";

function ChapterList() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    // Fetch chapters for the given year
    const fetchChapters = async () => {
      try {
        const response = await axiosInstance.get(`/year/${id}`, {
          withCredentials: true,
        });

        if (!response) {
          throw new Error("Network response was not ok");
        }

        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [id]);

  async function showOrHide() {
    setShowForm(!showForm);
  }

  async function handleFormSubmission(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", name);

      formData.append("price", 0);

      formData.append("year_of_study", id);

      formData.append("image", image);

      const response = await UploadChapter(formData);

      window.location.reload();

      return response.json();
    } catch (err) {
      return err.message;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="container-fluid"
      style={{
        marginBottom: "15px",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Col
        style={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <div className="StudentChapters">
          <div
            className="container-fluid justify-content-center m-6"
            style={{ padding: "10px" }}
          >
            {error ? (
              <p className="text-center text-danger mt-4">
                Failed to load chapters: {error}
              </p>
            ) : chapters.length > 0 ? (
              <Row className="justify-content-center align-items-center text-align-center">
                {chapters.map((chapter, index) => (
                  <Col
                    key={index}
                    sm={12}
                    md={6}
                    lg={4}
                    className="mb-4 d-flex justify-content-center"
                  >
                    <ChapterCardAdmin
                      chapterTitle={chapter.name}
                      chapterId={chapter.id}
                      image={chapter.image}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div>
                <p className="text-center mt-4">لا توجد فصول بعد</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <button
            className="btn btn-lg btn-success"
            style={{
              textAlign: "center",
              justifyContent: "center",
              margin: "20px",
            }}
            onClick={() => showOrHide()}
          >
            {" "}
            {showForm ? "فصل جديد" : "غلق القائمة"}
          </button>
        </div>

        {!showForm && (
          <Form onSubmit={handleFormSubmission}>
            <div>
              <div
                className="container-fluid"
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  marginTop: "25px",
                  maxWidth: "400px",
                }}
              >
                <div className="col-auto">
                  <label style={{ marginBottom: "10px" }}>اسم الفصل</label>
                  <input
                    type="text"
                    id="zaName"
                    className="form-control"
                    placeholder="Chapter name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <label style={{ marginBottom: "10px" }}>
                    صورة الفصل للعرض
                  </label>
                  <input
                    type="file"
                    id="imagechapter"
                    className="form-control"
                    placeholder="Chapter name"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
              <Button
                className="btn btn-success"
                style={{ marginBottom: "20px" }}
                type="submit"
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
                    Submitting...
                  </>
                ) : (
                  "تأكيد"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Col>
    </div>
  );
}

export default ChapterList;
