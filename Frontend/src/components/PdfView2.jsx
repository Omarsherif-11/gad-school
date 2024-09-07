import React, { useEffect, useRef } from "react";
import { pdfjs } from "react-pdf";
import "pdfjs-dist/webpack";
import "./PdfView2.css";
const PdfView2 = ({ url }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;

      const pageNumber = 1;
      const page = await pdf.getPage(pageNumber);

      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      containerRef.current.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
    };

    loadPdf();
  }, [url]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto", // Enable scrollbars if necessary
        position: "relative",
      }}
    />
  );
};

export default PdfView2;
