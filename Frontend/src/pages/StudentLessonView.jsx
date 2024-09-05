import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLesson } from "../api/auth";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import "./StudentLessonView.css";
import Cookies from "js-cookie";
import React from "react";
import ReactPlayer from "react-player";
import { useRef } from "react";
import { API_URL } from "../api/auth";

function StudentLessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const getTheLesson = async () => {
      try {
        const response = await getLesson(lessonId);

        if (!response) throw new Error("No such lesson");

        setLesson(response);
      } catch (err) {
        alert(err.message);
      }
    };

    getTheLesson();
  }, [lessonId]);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  const containerRef = useRef(null); // Reference to the container div
  const playerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    if (
      document.fullscreenElement === containerRef.current ||
      document.webkitFullscreenElement === containerRef.current ||
      document.mozFullScreenElement === containerRef.current ||
      document.msFullscreenElement === containerRef.current
    ) {
      setIsFullscreen(true);
      playerRef.current.getInternalPlayer().play();
    } else {
      setIsFullscreen(false);
      console.log("Exiting fullscreen");
      if (playerRef.current) {
        playerRef.current.getInternalPlayer().pause();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, [lesson]);

  // Enter fullscreen
  const handleEnterFullscreen = () => {
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if (containerRef.current.webkitRequestFullscreen) {
      containerRef.current.webkitRequestFullscreen();
    } else if (containerRef.current.mozRequestFullScreen) {
      containerRef.current.mozRequestFullScreen();
    } else if (containerRef.current.msRequestFullscreen) {
      containerRef.current.msRequestFullscreen();
    }
  };

  const keyFrames = `@keyframes moveOverlay {
   0% {
    transform: translateX(-90%); /* Start off-screen to the left */
  
  50% {
    transform: translateX(90%); /* Move off-screen to the right */
  }
  100% {
    transform: translateX(-90%); /* Return to starting position */
  }
}`;

  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player.paused) {
        player.play();
        setPlaying(true);
      } else {
        player.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <div className="lesson-container">
      {lesson && (
        <Col className="lesson-col">
          <div className="lesson-card">
            <h1 className="lesson-title">{lesson.name}</h1>
            <p className="lesson-description">{lesson.description}</p>
            <div className="video-container" onContextMenu={handleContextMenu}>
              <style>{keyFrames}</style>
              <div
                className="container-fluid"
                ref={containerRef}
                style={{
                  marginBottom: "15px",
                  alignContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  width: "75%",
                  height: "auto",
                  position: "relative",
                  padding: 0,
                }}
              >
                <ReactPlayer
                  ref={playerRef}
                  url={`${API_URL}/videos/${lesson.video}`}
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload", // Prevent download
                        disablePictureInPicture: true, // Disable PiP
                      },
                    },
                  }}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    position: "center",
                    padding: 0,
                  }}
                  onPlay={handleEnterFullscreen}
                />
                {isFullscreen && (
                  <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "100%",
                      height: "100%",
                      zIndex: 9999,
                      fontSize: "30px",
                      animation: "moveOverlay 10s linear infinite",
                      padding: 0,
                    }}
                  >
                    {Cookies.get("email")}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="back-button"
            >
              الرجوع
            </Button>
          </div>
        </Col>
      )}
    </div>
  );
}

export default StudentLessonView;
