import { axiosInstance } from "./auth";

export const getQuizOfLesson = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`/lesson/quiz/${lessonId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadQuiz = async (quizData) => {
  try {
    const response = await axiosInstance.put(`/updateQuiz`, quizData, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadQuestion = async (questionData) => {
  try {
    const response = questionData.id
      ? await axiosInstance.put(`/updateQuestion`, questionData, {
          withCredentials: true,
        })
      : await axiosInstance.post(`/addQuestion`, questionData, {
          withCredentials: true,
        });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.delete(`/deleteQuestion`, {
      data: { id: questionId },
    });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deleteChoice = async (choiceId) => {
  try {
    const response = await axiosInstance.delete(`/deleteChoice/${choiceId}`);
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
