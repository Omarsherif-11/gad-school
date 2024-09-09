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
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function PdfView2() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }



  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};

export default PdfView2;
