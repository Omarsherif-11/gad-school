// // App.jsx
// import React from "react";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import MyDocument from "./MyDocument";

// const PdfView2 = ({ url }) => (
//   <div className="App">
//     <h1>PDF Generator Example</h1>
//     <PDFDownloadLink document={<MyDocument />} fileName={url}>
//       {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
//     </PDFDownloadLink>
//   </div>
// );

// export default PdfView2;

// PdfViewer.jsx
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up the worker file from a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.min.mjs`;

const PdfView2 = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Callback when the PDF is loaded
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="pdf-viewer-container">
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="pagination">
        {Array.from({ length: numPages }, (_, index) => (
          <button key={index} onClick={() => setPageNumber(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PdfView2;
