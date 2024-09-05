import { Card, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

import { axiosInstance } from "../api/auth";

import { API_URL } from "../api/auth";

function QuestionCard(props) {
  const [choices, setChoices] = useState([]);

  const [answer, setAnswer] = useState(props.answer ? props.answer : 0);

  const [show, setShow] = useState(false);

  const [newChoice, setNewChoice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getChoices = async () => {
      try {
        const response = await axiosInstance.get(
          `/questionChoices/${props.id}`,
          { withCredentials: true }
        );

        setChoices(response.data);
      } catch (err) {
        alert(err.response.data);
      }
    };

    getChoices();
  }, [props.id]);

  async function handleSelect(e) {
    try {
      const newAnswer = e.target.value;

      setAnswer(newAnswer);

      axiosInstance
        .patch(
          "/setAnswer",
          { id: props.id, answerIndex: newAnswer },
          { withCredentials: true }
        )

        .then(window.location.reload())

        .catch((err) => {
          throw new Error("Update failed, try again");
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function showOrHide() {
    setShow(!show);
  }

  async function handleAddChoice() {
    try {
      setLoading(true);
      if (newChoice) {
        const response = await axiosInstance.post(
          "/addChoice",
          { text: newChoice, question_id: props.id },
          { withCredentials: true }
        );

        if (!response) throw new Error("Failed to add choice");

        window.location.reload();
      } else {
        alert("Choice can't be empty");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      const response = await axiosInstance.delete("/deleteQuestion", {
        withCredentials: true,
        data: { id: props.id },
      });

      window.location.reload();
    } catch (err) {
      alert(err);
    }
  }

  async function deleteChoice(id) {
    try {
      const response = await axiosInstance.delete("/deleteChoice", {
        data: { id },
      });

      if (!response) throw new Error("NOT OK");

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Card
      style={{
        margin: "20px",
        maxwidth: "800px",
        padding: "10px",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {choices && (
        <Card.Body>
          <Card.Title style={{ marginBottom: "20px" }}>{props.text}</Card.Title>
          {props.image && (
            <Card.Img
              variant="top"
              src={`${API_URL}/images/${props.image}`}
              style={{ marginBottom: "30px" }}
            />
          )}
          <div
            className="container-fluid"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            {choices.map((choice, index) => (
              <div
                className="container-fluid"
                style={{ alignItems: "center", justifyContent: "center" }}
                key={index}
              >
                <div className="form-check">
                  <label
                    className="form-check-label"
                    style={{
                      marginBottom: "10px",
                      maxWidth: "600px",
                      marginLeft: "50px",
                    }}
                  >
                    {choice.choice_text}
                  </label>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(e) => deleteChoice(choice.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className="container-fluid"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <label style={{ marginBottom: "10px", maxWidth: "800px" }}>
              الصحيحة
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={handleSelect}
              value={answer}
            >
              <option value={0} disabled key={-1}>
                اختر اجابة
              </option>
              {choices.map((choice, index) => (
                <option value={index + 1} key={index}>
                  {choice.choice_text}
                </option>
              ))}
            </select>
          </div>
          <div
            className="container-fluid"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <button className="btn btn-success" onClick={showOrHide}>
              أضف اختيار
            </button>
            {/*<button
              className="btn btn-danger"
              style={{ margin: "15px" }}
              onClick={handleDelete}
            >
              حذف السؤال
            </button>*/}
            <Button
              className="btn btn-danger"
              onClick={handleDelete}
              style={{ margin: "15px" }}
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
                "حذف السؤال"
              )}
            </Button>
          </div>

          {show && (
            <div
              className="container-fluid"
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <div
                className="container-fluid"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  required
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="Choice text"
                  onChange={(e) => setNewChoice(e.target.value)}
                ></input>
              </div>
              <div
                className="container-fluid"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <button className="btn btn-success" onClick={handleAddChoice}>
                  اضافة
                </button>
              </div>
            </div>
          )}
        </Card.Body>
      )}
    </Card>
  );
}

export default QuestionCard;
