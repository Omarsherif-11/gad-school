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
      <div className="pdf-scroll-container">
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
    </div>
  );
}

export default PdfView2;
