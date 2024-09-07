import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";

import Button from "react-bootstrap/Button";
import "./StudentLessons.css";
import PaymentPopup from "../components/PaymentPopup";
import Cookies from "js-cookie";
import { axiosInstance } from "../api/auth";

import { API_URL } from "../api/auth";

function StudentLessons() {
  const { yearId, chapterId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const navigate = useNavigate();
  const calculateTotalPrice = (selected) => {
    return selected.reduce((acc, lesson) => acc + parseFloat(lesson.price), 0);
  };

  useEffect(() => {
    axiosInstance
      .get(`/chapters/${chapterId}`, { withCredentials: true })
      .then((response) => {
        const sortedLessons = response.data.sort((a, b) => a.number - b.number);
        setLessons(sortedLessons);
        console.log("sorted", sortedLessons);
        const initiallySelected = sortedLessons.filter(
          (lesson) => !lesson.isBought
        );
        setSelectedLessons(initiallySelected);

        const initialPrice = calculateTotalPrice(initiallySelected);
        setTotalPrice(initialPrice);
        console.log("the lessons", response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
        setError("Failed to load lessons.");
        setLessons([]);
      });
  }, [chapterId, yearId]);

  useEffect(() => {
    const updatedTotalPrice = calculateTotalPrice(selectedLessons);
    setTotalPrice(updatedTotalPrice);
  }, [selectedLessons]);

  const handleCheckboxChange = (lessonId) => {
    setSelectedLessons((prev) => {
      const isSelected = prev.some((lesson) => lesson.id === lessonId);
      let updatedSelectedLessons;

      if (isSelected) {
        updatedSelectedLessons = prev.filter(
          (lesson) => lesson.id !== lessonId
        );
      } else {
        const newLesson = lessons.find((lesson) => lesson.id === lessonId);
        updatedSelectedLessons = [...prev, newLesson];
      }

      return updatedSelectedLessons;
    });
  };

  const handleBuy = async (paymentMethod, phoneNumber) => {
    try {
      console.log("i am here and lessons.out", lessons.out);

      const response = await axiosInstance.post(
        `/createPayment`,
        {
          lessons: selectedLessons,
          paymentMethod: paymentMethod,
          phoneNumber: phoneNumber,
          yearId: yearId,
          chapterId: chapterId,
        },
        { withCredentials: true }
      );

      if (paymentMethod === "wallet") {
        const paymentUrl = response.data.walletResponse.redirect_url;
        window.location.href = paymentUrl;
      } else {
        const { paymentKey } = response.data;
        const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/785370?payment_token=${paymentKey}`;
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const closePopup = () => setIsPopupOpen(false);

  const handleBuySolo = async (lesson) => {
    if (!Cookies.get("username")) {
      window.location.href = "/login";
    } else {
      setSelectedLessons([lesson]);
      setIsPopupOpen(true);
    }
  };

  const handleBuyAll = async () => {
    if (!Cookies.get("username")) {
      window.location.href = "/login";
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleGoToLesson = (lessonId) => {
    navigate(`/year/${yearId}/chapters/${chapterId}/lessons/${lessonId}`);
  };
  const handleTakeQuiz = (lessonId) => {
    navigate(`/year/${yearId}/chapters/${chapterId}/lesson/quiz/${lessonId}`);
  };

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
    <div className="lessons-container">
      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        {error && (
          <div className="text-center mb-4 text-danger">
            <p>{error}</p>
          </div>
        )}

        {selectedLessons.length > 0 && (
          <div className="text-center mb-4">
            <Button className="btn btn-success" onClick={handleBuyAll}>
              شراء الدروس المحددة مقابل {totalPrice.toFixed(2)} جنيه مصري
            </Button>
          </div>
        )}

        {lessons.length === 0 && !error ? (
          <p className="text-center">لم يتم العثور على دروس.</p>
        ) : (
          <Col
          style={{
            justifyContent: "center",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
            {lessons.map((lesson, index) => (
              <Col key={lesson.id} xs={12} className="lessons-col">
                <Card className="lesson-card" key={index}>
                  {!lesson.isBought && (
                    <input
                      type="checkbox"
                      checked={selectedLessons.some(
                        (sl) => sl.id === lesson.id
                      )}
                      className="position-absolute top-0 end-0 m-2 custom-checkbox"
                      onChange={() => handleCheckboxChange(lesson.id)}
                    />
                  )}
                  <Card.Img
                    variant="top"
                    src={
                      `${API_URL}/images/${lesson.image}` ||
                      "holder.js/100px160"
                    }
                  />
                  <Card.Body>
                    <Card.Title>{lesson.name}</Card.Title>
                    <Card.Text>{lesson.brief}</Card.Text>
                    <div className="status-badge">
                      {lesson.isBought && (
                        <Badge bg="warning">
                          <h5>{lesson.price} جنيه مصري</h5>
                          <p>درس + اختبار</p>
                        </Badge>
                      )}
                    </div>
                    <div className="card-button-group">
                      {lesson.isBought ? (
                        <>
                          <Button
                            variant="primary"
                            onClick={() => handleGoToLesson(lesson.id)}
                          >
                            الذهاب إلى الدرس
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleTakeQuiz(lesson.id)}
                          >
                            الاختبار
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => handleBuySolo(lesson)}
                        >
                          شراء الدرس مقابل {lesson.price} جنيه مصري
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Col>
        )}

        <PaymentPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          handleBuy={handleBuy}
        />
      </div>
      </div>
    </div>
  );
}

export default StudentLessons;
