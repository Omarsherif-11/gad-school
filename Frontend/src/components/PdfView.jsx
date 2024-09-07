import React from "react";

const PDFView = ({ url }) => {
  return (
    <iframe
      src={url}
      width="100%"
      height="100vh"
      style={{ border: "none" }}
      title="PDF Viewer"
    />
  );
};

export default PDFView;
