import React from "react";
import "./PdfView.css";

const PdfView = ({ url }) => {
  return (
    <div className="pdf-viewer-container">
      <iframe src={url} className="pdf-viewer" title="PDF Viewer" />
    </div>
  );
};

export default PdfView;
