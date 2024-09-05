import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Image, Spinner } from "react-bootstrap";
import { FaClock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./StudentQuiz.css";
import { axiosInstance, API_URL } from "../api/auth";

const StudentQuiz = () => {
  const { yearId, chapterId, quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state for submission status

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.get(`/quiz/${quizId}`, {
          withCredentials: true,
        });

        setQuizData(response.data);
        console.log(response);
        const storedTime = localStorage.getItem(`quiz-${quizId}-endTime`);
        if (storedTime) {
          const remaining = new Date(storedTime).getTime() - Date.now();
          if (remaining > 0) {
            setRemainingTime(Math.floor(remaining / 1000));
          } else {
            await handleSubmit(true);
          }
        } else {
          const endTime = Date.now() + response.data.timer * 60000;
          localStorage.setItem(`quiz-${quizId}-endTime`, new Date(endTime));
          setRemainingTime(response.data.timer * 60);
        }
      } catch (error) {
        setError("فشل في تحميل الاختبار. يرجى المحاولة مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const timerInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleSubmit(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [remainingTime]);

  const currentQuestion = useMemo(
    () => quizData?.Questions[currentQuestionIndex],
    [quizData, currentQuestionIndex]
  );
  const totalQuestions = quizData?.Questions.length || 0;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleAnswerChange = (optionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.id]: optionId,
    }));
  };

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

  const handleOptionSelect = (option) => {
    handleAnswerChange(option.id);
  };

  const handleSubmit = async (isTimeOut) => {
    if (!isTimeOut) {
      const unansweredQuestions = quizData.Questions.filter(
        (question) => !selectedAnswers[question.id]
      );

      if (unansweredQuestions.length > 0) {
        const proceed = window.confirm(
          `لديك ${unansweredQuestions.length} أسئلة غير مجابة. هل تريد متابعة تسليم الاختبار؟`
        );
        if (!proceed) {
          return;
        }
      }
      const finalConfirmation = window.confirm(
        "هل أنت متأكد أنك تريد تسليم الاختبار؟"
      );

      if (!finalConfirmation) {
        return;
      }
    }

    setIsSubmitting(true); // Set submitting state to true

    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(
        ([questionId, answerId]) => ({
          question_id: parseInt(questionId, 10),
          answer_id: parseInt(answerId, 10),
        })
      );

      const response = await axiosInstance.post(
        `/submitQuiz/${quizId}`,
        { answers: formattedAnswers },
        { withCredentials: true }
      );
      localStorage.removeItem(`quiz-${quizId}-endTime`);

      toast.success(
        `تم تسليم الاختبار بنجاح! درجتك هي ${response.data.score} / ${totalQuestions}`
      );

      setTimeout(() => {
        window.location.href = `/year/${yearId}/chapters/${chapterId}/lesson/quiz/${quizData.lesson_id}`;
      }, 1500);
    } catch (error) {
      console.error("خطأ في تسليم الاختبار:", error);
      toast.error("فشل في تسليم الاختبار. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false); // Reset submitting state to false
    }
  };

  if (loading) {
    return <div>جار التحميل...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="quiz-page">
      <ToastContainer />
      <div className="quiz-header">
        <h2 className="quiz-title">{quizData.name}</h2>
        <div className="quiz-timer">
          <FaClock /> {formatTime(remainingTime)} دقيقة
        </div>
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
            {currentQuestion?.Choices.map((option) => (
              <div
                key={option.id}
                className={`option ${
                  selectedAnswers[currentQuestion.id] === option.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleOptionSelect(option)}
                aria-label={`اختيار: ${option.choice_text}`}
              >
                {option.choice_text}
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

        {currentQuestionIndex === totalQuestions - 1 && (
          <Button
            className="submit-button"
            onClick={async () => await handleSubmit(false)}
            aria-label="تقديم الاختبار"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                تقديم الاختبار...
              </>
            ) : (
              "تسليم الاختبار"
            )}
          </Button>
        )}

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

export default StudentQuiz;
