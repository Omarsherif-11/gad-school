import { Document, Page } from "react-pdf";
import "./PdfView.css";
import { API_URL } from "../api/auth";

function PdfView({ pdf_name }) {
  return (
    <div className="pdf-viewer">
      <Document file={`${API_URL}/pdfs/${pdf_name}`}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default PdfView;
