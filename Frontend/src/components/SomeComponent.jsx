import React from "react";
import WatermarkOverlay from "./WatermarkOverlay";
import LessonImage from "../assets/lesson-image.jpeg";

const SomeComponent = () => {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <h1>Hi, how are you?</h1>
      <img src={LessonImage} alt="Lesson" style={{ width: "100%" }} />

      <WatermarkOverlay />
    </div>
  );
};

export default SomeComponent;
