import React, { useEffect, useState } from "react";
import "./ScoresTable.css"; // Import the CSS for table styles

import { axiosInstance } from "../api/auth";

const ScoresTable = ({ quizId, total }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentsWithScores = async () => {
      try {
        const response = await axiosInstance.get(`/students-scores/${quizId}`, {
          withCredentials: true,
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student scores:", error);
      }
    };

    fetchStudentsWithScores();
  }, [quizId]);

  return (
    <div>
      <h1>Students and Their Quiz Scores</h1>
      <table className="scores-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>Quiz</th>
            <th>Score / {total}</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
                <td>{student.mobile_num}</td>
                {student.StudentQuizzes.map((quizEntry) => (
                  <React.Fragment key={quizEntry.Quiz.id}>
                    <td>{quizEntry.Quiz.name}</td>
                    <td>{quizEntry.score}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoresTable;
