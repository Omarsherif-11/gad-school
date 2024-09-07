import React from "react";
import "./PDFView.css";

const PDFView = ({ url }) => {
  return (
    <div className="pdf-viewer-container">
      <iframe src={url} className="pdf-viewer" title="PDF Viewer" />
    </div>
  );
};

export default PDFView;
