import { Document, Page } from "react-pdf";
import "./PdfView.css";
import { API_URL } from "../api/auth";

function PdfView({ pdf_name }) {
    const url = `${API_URL}/pdfs/${pdf_name}`;
    console.log("url:", url);
    const [error, setError] = React.useState(null);

    return (
      <div className="pdf-viewer">
        <Document
          file={`${API_URL}/pdfs/${pdf_name}`}
          onLoadError={(error) => setError(error)}
        >
          <Page pageNumber={1} />
        </Document>
        {error && <div>Error loading PDF: {error.message}</div>}
      </div>
    );
}

export default PdfView;
