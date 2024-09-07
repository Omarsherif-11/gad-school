import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AllLessons } from "../api/auth";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LessonCard from "./LessonCard";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner for loading indicator
import { axiosInstance } from "../api/auth";

function AdminLessons(props) {
  const { id } = useParams();

  const [lessons, setLessons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const allLessons = async () => {
      try {
        const response = await AllLessons(id);

        if (!response) {
          throw new Error("Network response was not ok");
        }

        setLessons(response);
      } catch (err) {
        setError(err.message);
      }
    };

    allLessons();
  }, [id]);

  async function showOrHide() {
    setShowForm(!showForm);
  }

  async function handleFormSubmission(e) {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting form submission

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("view_count", 0);
    formData.append("chapter", id);
    formData.append("price", price);
    formData.append("lesson", lessons.length + 1);
    formData.append(
      "videoExtension",
      video.name.split(".").pop().toLowerCase()
    );
    formData.append(
      "imageExtension",
      image.name.split(".").pop().toLowerCase()
    );
    formData.append("brief", brief);
    formData.append("video", video);
    formData.append("image", image);

    try {
      const response = await axiosInstance.post(
        "/uploadLesson",
        formData,
        { withCredentials: true },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response) throw new Error("Network response was not ok");

      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Reset loading state once done
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
        textAlign: "center",
      }}
    >
      <Col
        style={{
          justifyContent: "center",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        <div className="StudentLessons">
          <div
            className="container-fluid justify-content-center m-6"
            style={{ padding: "10px" }}
          >
            {error ? (
              <p className="text-center text-danger mt-4">
                Failed to load lessons: {error}
              </p>
            ) : lessons.length > 0 ? (
              <Row className="justify-content-center align-items-center text-align-center">
                {lessons.map((lesson, index) => (
                  <Col
                    key={index}
                    sm={12}
                    md={6}
                    lg={4}
                    className="mb-4 d-flex justify-content-center"
                  >
                    <LessonCard
                      name={lesson.name}
                      image={lesson.image}
                      video={lesson.video}
                      price={lesson.price}
                      id={lesson.id}
                      brief={lesson.brief}
                      view_count={lesson.view_count}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <div>
                <p className="text-center mt-4">لا يوجد دروس بعد</p>
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: "center", justifyContent: "center" }}>
          <Button
            className="btn btn-lg btn-success"
            style={{
              textAlign: "center",
              justifyContent: "center",
              margin: "20px",
            }}
            onClick={() => showOrHide()}
          >
            {showForm ? "درس جديد" : "غلق القائمة"}
          </Button>
        </div>

        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {!showForm && (
            <Form
              style={{
                maxWidth: "30%",
                justifyContent: "center",
                textAlign: "center",
              }}
              onSubmit={handleFormSubmission}
            >
              <div
                className="container-fluid"
                style={{
                  marginBottom: "15px",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="col g-3 align-items-center"
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                    marginTop: "25px",
                  }}
                >
                  <div className="col-auto">
                    <label style={{ marginBottom: "15px" }}>اسم الدرس</label>
                    <input
                      type="text"
                      id="zaName"
                      className="form-control"
                      placeholder="Lesson name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <label style={{ marginBottom: "15px" }}>شرح الدرس</label>
                    <textarea
                      type="text"
                      id="zaName"
                      className="form-control"
                      placeholder="Lesson Description"
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ marginBottom: "15px" }}
                    />
                  </div>
                  <div className="col-auto">
                    <label style={{ marginBottom: "15px" }}>سعر الدرس</label>
                    <input
                      type="number"
                      id="zaName"
                      className="form-control"
                      placeholder="Lesson price"
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ marginBottom: "15px" }}
                      required
                    />
                  </div>
                  <div className="col-auto">
                    <label style={{ marginBottom: "15px" }}>وصف ملخص</label>
                    <textarea
                      type="text"
                      id="zaName"
                      className="form-control"
                      placeholder="Brief description"
                      onChange={(e) => setBrief(e.target.value)}
                      style={{ marginBottom: "15px" }}
                    />
                  </div>
                  <div className="col-auto">
                    <label style={{ marginBottom: "15px" }}>فيديو الشرح</label>
                    <input
                      type="file"
                      id="zaName"
                      className="form-control"
                      placeholder="Video"
                      onChange={(e) => setVideo(e.target.files[0])}
                      style={{ marginBottom: "15px" }}
                      required
                    />
                  </div>
                  <label style={{ marginBottom: "15px" }}>صورة للعرض</label>
                  <div className="col-auto">
                    <input
                      type="file"
                      id="zaName"
                      className="form-control"
                      placeholder="Image"
                      onChange={(e) => setImage(e.target.files[0])}
                      style={{ marginBottom: "15px" }}
                      required
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
        </div>
      </Col>
    </div>
  );
}

export default AdminLessons;
