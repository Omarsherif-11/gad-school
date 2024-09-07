import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import "./PdfView.css";
import { API_URL } from "../api/auth";
import { useState } from "react";

function PdfView({ pdf_name }) {
  const url = `${API_URL}/pdfs/${pdf_name}`;
  console.log("url:", url);
  const [error, setError] = useState(null);

  return (
    <div className="pdf-viewer">
      <Document file={url} onLoadError={(error) => setError(error)}>
        <Page pageNumber={1} />
      </Document>
      {error && <div>Error loading PDF: {error.message}</div>}
    </div>
  );
}

export default PdfView;
