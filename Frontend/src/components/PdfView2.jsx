// App.jsx
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const PdfView2 = ({ url }) => (
  <div className="App">
    <h1>PDF Generator Example</h1>
    <PDFDownloadLink document={<MyDocument />} fileName={url}>
      {({ loading }) => (loading ? "Loading document..." : "Download PDF")}
    </PDFDownloadLink>
  </div>
);

export default PdfView2;
