import watermark from "../assets/watermark.webp";

import React, { useEffect } from "react";

const WatermarkOverlay = () => {
  useEffect(() => {
    const createOverlay = () => {
      const existingOverlay = document.getElementById("blackoutOverlay");
      if (!existingOverlay) {
        const overlay = document.createElement("div");
        overlay.id = "blackoutOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.zIndex = "9999";
        overlay.style.pointerEvents = "none";
        overlay.style.backgroundColor = "rgba(255, 255, 255, 0.001)"; // Very light color
        overlay.style.mixBlendMode = "difference"; // Subtle blend mode to affect screenshots

        document.body.appendChild(overlay);
      }
    };

    createOverlay();

    const intervalId = setInterval(createOverlay, 500);

    return () => clearInterval(intervalId);
  }, []);

  return null;
};

export default WatermarkOverlay;
