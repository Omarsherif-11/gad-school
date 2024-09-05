import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post(`/signUp`, userData, {
      withCredentials: true, // Ensures cookies are sent with the request
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(
      `/logIn`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutService = async () => {
  try {
    const response = await axiosInstance.post(
      `/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const allChapters = async (id) => {
  try {
    const response = await axiosInstance.get(`/year/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const UploadChapter = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/addChapter`,
      data,
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw err.response.data;
  }
};

export const addQuestion = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/addQuestion`,
      data,
      { withCredentials: true },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
export const AllLessons = async (id) => {
  try {
    const response = await axiosInstance.get(`/chapters/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deleteChapter = async (id) => {
  try {
    const response = await axiosInstance.delete(`/deleteChapter`, {
      data: { chapter: id },
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const deleteLesson = async (lesson) => {
  try {
    const response = await axiosInstance.delete(`/deleteLesson`, {
      withCredentials: true,
      data: { lesson },
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getLesson = async (id) => {
  try {
    const response = await axiosInstance.get(`/lessons/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};

export const getQuiz = async (id) => {};
