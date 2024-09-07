import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChapterCard from "../components/ChapterCard";
import Container from "react-bootstrap/Container";
import { axiosInstance } from "../api/auth";
import Col from 'react-bootstrap/Col'
function StudentChapters() {
  const { yearId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axiosInstance.get(`/year/${yearId}`, {
          withCredentials: true,
        });

        setChapters(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
        console.error("Error fetching chapters:", err);
      }
    };

    if (yearId) {
      fetchChapters();
    }
  }, [yearId]);
  console.log("chapters", chapters);

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
                    <ChapterCard chapter={chapter} />
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
      </Col>
    </div>
  );
}

export default StudentChapters;
