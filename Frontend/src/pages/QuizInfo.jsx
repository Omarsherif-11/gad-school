import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { FaClock, FaQuestionCircle, FaList, FaStar } from "react-icons/fa";
import "./QuizInfo.css";
import { axiosInstance } from "../api/auth";

const QuizInfo = () => {
  const { yearId, chapterId, lessonId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/lesson/quiz/${lessonId}`, {
          withCredentials: true,
        });
        setQuiz(response.data);
      } catch (error) {
        console.error("خطأ في جلب الاختبار:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const handleStartQuiz = (quizId) => {
    window.location.href = `/year/${yearId}/chapters/${chapterId}/quiz/start/${quizId}`;
  };

  const handleReview = (quizId) => {
    window.location.href = `/quiz/review/${quizId}`;
  };

  const handleBackToLesson = () => {
    window.location.href = `/year/${yearId}/chapters/${chapterId}`;
  };

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner"></div>جارٍ التحميل...
      </div>
    );

  if (!quiz) {
    return (
      <Card className="quiz-info-card">
        <Card.Body>
          <Card.Title>لا يوجد اختبار</Card.Title>
          <Card.Text>
            عذرًا، لا يوجد اختبار مرتبط بهذا الدرس. يرجى التحقق لاحقًا أو
            الاتصال بالمدرس لمزيد من المعلومات.
          </Card.Text>
          <Button
            variant="secondary"
            onClick={handleBackToLesson}
            disabled={loading}
          >
            العودة إلى الدرس
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="quiz-info-card">
      <Card.Body>
        <Card.Title>{quiz.name}</Card.Title>
        <Card.Text>
          <FaClock style={{ marginRight: "10px" }} /> مدة الاختبار: {quiz.timer}{" "}
          دقيقة
        </Card.Text>
        <Card.Text>
          <FaList style={{ marginRight: "10px" }} /> عدد الأسئلة: {quiz.score}
        </Card.Text>
        <Card.Text>
          <FaQuestionCircle style={{ marginRight: "10px" }} /> التعليمات:{" "}
          {quiz.instructions || "لا غش"}
        </Card.Text>
        {quiz.student_score !== undefined && (
          <div className="score-review-container">
            <Card.Text style={{ margin: 0 }}>
              <FaStar style={{ marginRight: "10px" }} /> آخر درجة حصلت عليها:{" "}
              {quiz.student_score} / {quiz.score}
            </Card.Text>
            <Button
              variant="info"
              onClick={() => handleReview(quiz.id)}
              style={{ marginLeft: "10px" }}
              disabled={loading}
            >
              مراجعة
            </Button>
          </div>
        )}
        <div className="quiz-info-buttons">
          <Button
            variant="primary"
            onClick={() => handleStartQuiz(quiz.id)}
            disabled={loading}
          >
            بدء الاختبار
          </Button>
          <Button
            variant="secondary"
            onClick={handleBackToLesson}
            style={{ marginLeft: "10px" }}
            disabled={loading}
          >
            العودة إلى الدرس
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuizInfo;
