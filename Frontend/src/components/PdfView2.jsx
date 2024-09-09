// App.jsx
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

// // PdfViewer.jsx
// import React, { useState } from "react";
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

// function PdfView2() {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setPageNumber(1);
//   }

//   return (
//     <div>
//       <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
//         {Array.from(new Array(numPages), (el, index) => (
//           <Page key={`page_${index + 1}`} pageNumber={index + 1} />
//         ))}
//       </Document>
//     </div>
//   );
// };

// export default PdfView2;



// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// const PDFViewer = ({ url }) => {
//   return (
//     <div style={{ height: "100vh", width: "100%" }}>
//       <Worker
//         workerUrl={`https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js`}
//       >
//         <Viewer fileUrl={url} />
//       </Worker>
//     </div>
//   );
// };

// export default PDFViewer;



// the problem is not loading
// import React, { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// // Set the workerSrc for PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js`;

// const PDFViewer = ({ url }) => {
//   const [numPages, setNumPages] = useState(null);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };


//   return (
//     <div
//       style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
//     >
//       <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
//         {Array.from(new Array(numPages), (el, index) => (
//           <Page
//             key={`page_${index + 1}`}
//             pageNumber={index + 1}
//             width={window.innerWidth}
//           />
//         ))}
//       </Document>
//     </div>
//   );
// };

// export default PDFViewer;

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./PdfView2.css"; // Import the CSS file

// Set the workerSrc for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfView2({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handlePreviousPage = () => setPageNumber(Math.max(pageNumber - 1, 1));
  const handleNextPage = () =>
    setPageNumber(Math.min(pageNumber + 1, numPages));

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-controls">
        <button onClick={handlePreviousPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <p className="page-info">
          Page {pageNumber} of {numPages}
        </p>
        <button onClick={handleNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
      <Document
        className="pdf-document"
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="loading-indicator">Loading PDF...</div>}
      >
        <Page
          pageNumber={pageNumber}
          width={window.innerWidth > 768 ? 600 : window.innerWidth - 40}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

export default PdfView2;

