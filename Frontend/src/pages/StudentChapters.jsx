import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChapterCard from "../components/ChapterCard";
import Container from "react-bootstrap/Container";
import "./StudentChapters.css";
import { axiosInstance } from "../api/auth";
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
    <div className="StudentChapters">
      <h1 className="text-center mt-4"> الفصول فى الصف الثانوى {yearId}</h1>

      <Container>
        {error ? (
          <p className="text-center text-danger mt-4">
            Failed to load chapters: {error}
          </p>
        ) : chapters.length > 0 ? (
          <div className="card-container">
            {chapters.map((chapter, index) => (
              <ChapterCard key={index} chapter={chapter} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">لا توجد فصول الأن</p>
        )}
      </Container>
    </div>
    </div>
  );
}

export default StudentChapters;
