import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Button } from "react-bootstrap";
import QuestionCard from "./QuestionCard";
import axios from "axios";
import { addQuestion } from "../api/auth";
import ScoresTable from "./ScoresTable";

import { axiosInstance } from "../api/auth";

function Quiz() {
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);

  const [timer, setTimer] = useState(0);

  const [oldTimer, setOldTimer] = useState(0);

  const [showForm, setShowForm] = useState(false);

  const [image, setImage] = useState(null);

  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axiosInstance.get(`/quiz/${id}`, {
          withCredentials: true,
        });

        console.log(response);

        setQuestions(response.data.Questions);

        setTimer(response.data.timer);

        setOldTimer(response.data.timer);
      } catch (err) {
        alert(err.message);
      }
    };

    getQuestions();
  }, []);

  async function showOrHide() {
    setShowForm(!showForm);
  }

  async function finishSubmission() {
    try {
      const data = new FormData();

      data.append("text", questionText);

      data.append("quiz_id", id);

      data.append("image", image);
      setLoading(true);
      const response = await addQuestion(data);

      if (!response) throw new Error("Not successful");

      window.location.reload();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  }

  async function changeTimer() {
    try {
      const response = await axiosInstance.patch(
        `/updateTimer`,
        { timer: timer, id: id },
        { withCredentials: true }
      );

      setOldTimer(timer);

      window.location.reload();
    } catch (err) {
      console.log(err);
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
        {questions.length === 0 ? (
          <h1>لا أسئلة بعد</h1>
        ) : (
          <div
            className="container-fluid"
            style={{
              maxWidth: "800px",
              marginBottom: "15px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              className="container-fluid"
              style={{
                maxWidth: "800px",
                marginBottom: "15px",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <h2
                style={{ marginBottom: "15px" }}
              >{`Quiz time :  ${oldTimer} minutes`}</h2>
              <input
                type="number"
                style={{
                  margin: "15px",
                  maxWidth: "200px",
                  background: "white",
                  height: "36px",
                  textAlign: "center",
                  color: "black",
                }}
                placeholder="New Time"
                onChange={(e) => setTimer(e.target.value)}
              ></input>
              <button className="btn btn-success " onClick={changeTimer}>
                غير الوقت المسموح
              </button>
            </div>
            {questions.map((question, index) => (
              <QuestionCard
                text={question.text}
                answer={question.choice_answer_id}
                id={question.id}
                image={question.image}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
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
        <button className="btn btn-success btn-lg" onClick={showOrHide}>
          {!showForm ? "سؤال جديد" : "غلق القائمة"}
        </button>
      </div>
      {showForm && (
        <div
          className="container-fluid"
          style={{
            marginBottom: "15px",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          <div
            className="container-fluid"
            style={{
              marginBottom: "15px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            <label style={{ margin: "15px" }}>نص السؤال</label>
            <textarea
              required
              type="text"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Question text"
              onChange={(e) => setQuestionText(e.target.value)}
            ></textarea>
          </div>
          <div
            className="container-fluid"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <label style={{ margin: "15px" }}>صورة للسؤال اختياري</label>
            <input
              type="file"
              className="form-control"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              placeholder="Choice image"
              onChange={(e) => setImage(e.target.files[0])}
            ></input>
          </div>
          <div
            className="container-fluid"
            style={{
              marginBottom: "15px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            <Button
              className="btn btn-success btn-lg"
              onClick={finishSubmission}
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
        </div>
      )}

      <div>
        <ScoresTable quizId={id} total={questions.length} />
      </div>
    </div>
  );
}

export default Quiz;
