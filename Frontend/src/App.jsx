import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { lightTheme, darkTheme } from "./styles/themes";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/globalStyles";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentChapters from "./pages/StudentChapters";
import StudentLessons from "./pages/StudentLessons";
import PaymentResult from "./pages/PaymentResult";
import QuizInfo from "./pages/QuizInfo";
import StudentQuiz from "./pages/StudentQuiz";
import StudentQuizReview from "./pages/StudentQuizReview";
import StudentLessonView from "./pages/StudentLessonView";
import Navbar from "./components/Navbar";
import SomeComponent from "./components/SomeComponent";
import Verify from "./pages/Verify";
import { useState } from "react";
import "./styles/themes.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ChapterList from "./components/ChapterList";
import AdminLessons from "./components/AdminLessons";
import Quiz from "./components/Quiz";
import LessonView from "./components/LessonView";
import CreateQuizNew from "./components/CreateQuizNew";
import Cookies from "js-cookie";
import Footer from "./components/Footer";
import EnvConfig from "./pages/EnvConfig";

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

const ThemedApp = () => {
  const { theme } = useTheme();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  return (
    <StyledThemeProvider theme={themeMode}>
      <GlobalStyles />
      <div>
        <Router>
          <div className="container-fluid">
            <Navbar bg="dark" variant="dark" expand="lg" />
          </div>
          <div
            className="container-fluid pt-5"
            style={{
              marginBottom: "15px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="container-fluid">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/signup" element={<Signup />} />
                {<Route path="year/:yearId" element={<StudentChapters />} />}
                <Route
                  path="/year/:yearId/chapters/:chapterId"
                  element={<StudentLessons />}
                />
                <Route
                  path="/year/:yearId/chapters/:chapterId/lesson/quiz/:lessonId"
                  element={<QuizInfo />}
                />

                <Route
                  path="/year/:yearId/chapters/:chapterId/quiz/start/:quizId"
                  element={<StudentQuiz />}
                />
                <Route
                  path="/year/:yearId/chapters/:chapterId/lessons/:lessonId"
                  element={<StudentLessonView />}
                />
                <Route
                  path="quiz/review/:quizId"
                  element={<StudentQuizReview />}
                />

                <Route path="paymentResult" element={<PaymentResult />} />
                <Route path="test" element={<CreateQuizNew />} />

                {Cookies.get("role") === "admin" && (
                  <>
                    <Route path="admin/config" element={<EnvConfig />} />

                    <Route path="admin/year/:id" element={<ChapterList />} />

                    <Route
                      path="admin/year/:id/chapters/:id"
                      element={<AdminLessons />}
                    />
                    <Route
                      path="admin/year/:id/chapters/:id/lessons/:id"
                      element={<LessonView />}
                    />
                    <Route
                      path="admin/year/:id/chapters/:chapterId/lessons/:id/quiz/:id"
                      element={<Quiz />}
                    />
                  </>
                )}
              </Routes>
            </div>
          </div>
          <div className="container-fluid">
            <Footer />
          </div>
        </Router>
      </div>
    </StyledThemeProvider>
  );
};

export default App;
