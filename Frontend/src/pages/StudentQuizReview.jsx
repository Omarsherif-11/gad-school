import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StudentQuizReview.css";
import { axiosInstance, API_URL } from "../api/auth";

const StudentQuizReview = () => {
  const { quizId } = useParams();
  const navigate = useNavigate(); // Create navigate function
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/quiz/review/${quizId}`, {
          withCredentials: true,
        });
        console.log(response.data);
        setQuizData(response.data.quiz);
      } catch (error) {
        setError("فشل تحميل الاختبار. يرجى المحاولة مرة أخرى في وقت لاحق.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const currentQuestion = useMemo(
    () => quizData?.questions[currentQuestionIndex],
    [quizData, currentQuestionIndex]
  );
  const totalQuestions = quizData?.questions.length || 0;

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const getOptionClass = (option) => {
    if (option.is_answer) {
      return "option correct";
    } else if (option.id === currentQuestion.studentAnswer) {
      return "option incorrect";
    }
    return "option";
  };

  if (loading) {
    return <div>جارٍ التحميل...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="quiz-page">
      <ToastContainer />
      <div className="quiz-header">
        <Button
          className="back-button"
          onClick={() => navigate(-1)} // Navigate back to the previous page
          aria-label="Back"
        >
          &larr; الرجوع
        </Button>
        <h2 className="quiz-title">{quizData.name}</h2>
      </div>

      <div className="question-index">
        السؤال {currentQuestionIndex + 1} / {totalQuestions}
      </div>

      <Card className="question-card">
        <Card.Body>
          <Card.Title className="question-text" aria-live="polite">
            {currentQuestionIndex + 1}. {currentQuestion?.text}
          </Card.Title>
          {currentQuestion?.image && (
            <Image
              src={`${API_URL}/images/${currentQuestion.image}`}
              alt="صورة السؤال"
              className="question-image"
            />
          )}
          <div className="options">
            {currentQuestion?.choices.map((option) => (
              <div
                key={option.id}
                className={getOptionClass(option)}
                aria-label={`اختيار: ${option.text}`}
              >
                {option.text}
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="nav-buttons">
        <Button
          className="nav-button"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          aria-label="السؤال السابق"
        >
          السؤال السابق
        </Button>

        <Button
          className="nav-button"
          onClick={handleNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          aria-label="السؤال التالي"
        >
          السؤال التالي
        </Button>
      </div>
    </div>
  );
};

export default StudentQuizReview;
