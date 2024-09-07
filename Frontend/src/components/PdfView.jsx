import React from "react";
import "./PdfView.css";

const PdfView = ({ url }) => {
  return (
    <div className="pdf-viewer-container">
      <iframe
        src={url}
        className="pdf-viewer"
        title="PDF Viewer"
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
      />
    </div>
  );
};

export default PdfView;
