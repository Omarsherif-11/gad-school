import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLesson, API_URL } from "../api/auth";
import React from "react";
import ReactPlayer from "react-player";
import "./lessonView.css";
import Cookies from "js-cookie";
import PdfViewer from "./PdfView";
import PdfView2 from "./PdfView2";
import { FaChevronUp, FaChevronDown } from "react-icons/fa"; // Importing icons

function LessonView() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isPdfVisible, setIsPdfVisible] = useState(true); // State to manage PDF visibility
  const [activePdf, setActivePdf] = useState(true); // Active state for dropdown
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const getTheLesson = async () => {
      try {
        const response = await getLesson(id);
        if (!response) throw new Error("No such lesson");
        setLesson(response);
      } catch (err) {
        alert(err.message);
      }
    };

    getTheLesson();
  }, [id]);

  async function goToQuiz() {
    navigate(`quiz/${id}`);
  }

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
      transform: translateX(-90%);
    }
    50% {
      transform: translateX(90%);
    }
    100% {
      transform: translateX(-90%);
    }
  }`;

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

  // Function to toggle PDF visibility
  const togglePdfVisibility = () => {
    setActivePdf(!activePdf);
    setIsPdfVisible(!isPdfVisible);
  };

  return (
    <>
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
        {lesson && (
          <div
            className="container-fluid"
            style={{
              marginBottom: "15px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <h1 style={{ marginBottom: "15px" }}>{lesson.name}</h1>

            {/* PDF Toggle Header */}
            <div
              className="pdf-header"
              onClick={togglePdfVisibility}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: "0" }}>الشرح </h3>
              <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                {activePdf ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {/* Conditionally render PdfViewer based on isPdfVisible state */}
            {isPdfVisible && (
              <div
                className="pdf-viewer-container"
                style={{
                  width: "75%",
                  marginBottom: "15px",
                }}
              >
                <PdfViewer url={`${API_URL}/pdfs/${lesson.description}`} />
                {/* <PdfView2 url={`${API_URL}/pdfs/${lesson.description}`} /> */}
              </div>
            )}

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
                      controlsList: "nodownload",
                      disablePictureInPicture: true,
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
            <br />
            <button className="btn btn-success btn-lg" onClick={goToQuiz}>
              الكويز الخاص بالدرس
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default LessonView;
