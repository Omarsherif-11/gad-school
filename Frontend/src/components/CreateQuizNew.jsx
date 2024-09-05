import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaTrashAlt,
  FaPlusCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  uploadQuestion,
  getQuizOfLesson,
  uploadQuiz,
  deleteQuestion,
  deleteChoice,
} from "../api/quiz.js";
import "./CreateQuizNew.css";

const CreateQuizNew = () => {
  const { lessonId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  useEffect(() => {

      const getQuiz = async () => {

        try{
        
          const response = await getQuizOfLesson(lessonId);

          console.log(response)

          setQuiz(response);

        }catch(err) {

        console.log(err.message);

      }
    }

    getQuiz();


  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const addQuestion = async () => {
    try {
      const newQuestion = {
        text: "",
        image: null,
        choices: [],
        quiz_id: quiz.id,
      };
      const response = await uploadQuestion(newQuestion);
      console.log("here at addQuestion", response);
      setQuiz({
        ...quiz,
        Questions: [...quiz.Questions, response],
      });
      setActiveQuestionIndex(quiz.Questions.length);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("There was an error adding the question. Please try again.");
    }
  };

  const toggleQuestion = async (index) => {
    try {
      const questionToUpdate = quiz.Questions[index];
      if (questionToUpdate.id) {
        await uploadQuestion(questionToUpdate);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      alert("There was an error updating the question. Please try again.");
    }
    if (index === activeQuestionIndex) {
      setActiveQuestionIndex(null);
    } else {
      setActiveQuestionIndex(index);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quiz.Questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, Questions: newQuestions });
  };

  const handleChoiceChange = (questionIndex, choiceIndex, field, value) => {
    const newQuestions = [...quiz.Questions];
    const newChoices = [...newQuestions[questionIndex].choices];
    newChoices[choiceIndex][field] = value;

    if (field === "is_answer") {
      newChoices.forEach((choice, idx) => {
        newChoices[idx].is_answer = idx === choiceIndex;
      });
    }

    newQuestions[questionIndex].choices = newChoices;
    setQuiz({ ...quiz, Questions: newQuestions });
  };

  const removeQuestion = async (index) => {
    try {
      const questionToRemove = quiz.Questions[index];
      if (questionToRemove.id) {
        await deleteQuestion(questionToRemove.id);
      }

      const newQuestions = [...quiz.Questions];
      newQuestions.splice(index, 1);
      setQuiz({ ...quiz, Questions: newQuestions });
      setActiveQuestionIndex(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("There was an error deleting the question. Please try again.");
    }
  };

  const addChoice = (questionIndex) => {
    const newQuestions = [...quiz.Questions];
    const newChoice = { choice_text: "", is_answer: false };
    if (!newQuestions[questionIndex].choices) {
      newQuestions[questionIndex].choices = [];
    }
    newQuestions[questionIndex].choices.push(newChoice);
    setQuiz({ ...quiz, Questions: newQuestions });
  };

  const removeChoice = async (questionIndex, choiceIndex) => {
    try {
      const questionToUpdate = quiz.Questions[questionIndex];
      const choiceToRemove = questionToUpdate.choices[choiceIndex];
      if (choiceToRemove.id) {
        await deleteChoice(choiceToRemove.id);
      }

      const newQuestions = [...quiz.Questions];
      newQuestions[questionIndex].choices.splice(choiceIndex, 1);
      setQuiz({ ...quiz, Questions: newQuestions });
    } catch (error) {
      console.error("Error deleting choice:", error);
      alert("There was an error deleting the choice. Please try again.");
    }
  };

  const submitFinalQuiz = async () => {
    const proceed = window.confirm("Are you sure you want to submit the quiz?");
    if (!proceed) return;

    if (!quiz.name || !quiz.timer || quiz.Questions.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      quiz.Questions.some(
        (q) =>
          !q.text ||
          q.choices.length === 0 ||
          !q.choices.some((c) => c.is_answer)
      )
    ) {
      alert(
        "Please make sure all Questions and choices are filled in, and each question has one correct answer."
      );
      return;
    }

    // Ensure the currently active question is updated before submission
    if (activeQuestionIndex !== null) {
      const questionToUpdate = quiz.Questions[activeQuestionIndex];
      if (questionToUpdate.id) {
        await uploadQuestion(questionToUpdate);
      }
      setActiveQuestionIndex(null);
    }

    try {
      await uploadQuiz({ ...quiz, lessonId: lessonId });
      alert("Quiz submitted successfully!");
      window.history.back();
    } catch (error) {
      console.error("Error submitting the quiz:", error);
      alert("There was an error submitting the quiz. Please try again.");
    }
  };

  return (
      quiz ?
      <div>
        <div className="quiz-container">
          <h1 className="quiz-title">Quiz Details</h1>
          <form>
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                name="title"
                value={quiz.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>timer (minutes)</label>
              <input
                type="number"
                name="timer"
                value={quiz.timer}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </form>
          <h1 className="questions-title">Questions Part</h1>
          {quiz.Questions.map((question, index) => (
            <div key={index} className="question-container">
              <div
                className="question-header"
                onClick={() => toggleQuestion(index)}
              >
                <h3>Question {index + 1}</h3>
                <span>
                  {activeQuestionIndex === index ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>

              {activeQuestionIndex === index && (
                <div className="question-content">
                  <textarea
                    placeholder="Question Text"
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(index, "text", e.target.value)
                    }
                    className="question-textarea"
                  ></textarea>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleQuestionChange(index, "image", e.target.files[0])
                    }
                    className="question-file-input"
                  />
                  <h4 className="choices-title">Choices</h4>
                  {question.choices &&
                    question.choices.length > 0 &&
                    question.choices.map((choice, choiceIndex) => (
                      <div key={choiceIndex} className="choice-container">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={choice.is_answer}
                          onChange={(e) =>
                            handleChoiceChange(
                              index,
                              choiceIndex,
                              "is_answer",
                              e.target.checked
                            )
                          }
                        />
                        <span className="correct-span">Correct </span>
                        <input
                          type="text"
                          placeholder="Choice Text"
                          value={choice.choice_text}
                          onChange={(e) =>
                            handleChoiceChange(
                              index,
                              choiceIndex,
                              "text",
                              e.target.value
                            )
                          }
                          className="choice-input"
                        />
                        <FaTrashAlt
                          onClick={() => removeChoice(index, choiceIndex)}
                          className="remove-icon"
                        />
                      </div>
                    ))}
                  <button
                    onClick={() => addChoice(index)}
                    className="add-choice-btn"
                  >
                    <FaPlusCircle /> Add Choice
                  </button>
                  <FaTrashAlt
                    onClick={() => removeQuestion(index)}
                    className="remove-icon"
                  />
                </div>
              )}
            </div>
          ))}

          <button onClick={addQuestion} className="add-question-btn">
            <FaPlusCircle /> Add Question
          </button>
          <button onClick={submitFinalQuiz} className="submit-quiz-btn">
            Submit Quiz
          </button>
        </div>
      </div> : <div>Loading...</div>
  );
};

export default CreateQuizNew;
