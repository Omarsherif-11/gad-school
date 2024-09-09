import React from "react";
import "./PdfView.css";
import { useEffect, useRef } from "react";
const PdfView = ({ url }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        iframe.style.height = iframe.contentDocument.body.scrollHeight + "px";
      };
    }
  }, []);
  return (
    <div className="pdf-viewer-container">
      <iframe
        src={url}
        className="pdf-viewer"
        title="PDF Viewer"
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
        ref={iframeRef}
      />
    </div>
  );
};

export default PdfView;
