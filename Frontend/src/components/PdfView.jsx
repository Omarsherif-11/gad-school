import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../api/auth";
import { pdfjs } from "pdfjs-dist";
import "./PdfView.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PdfView({ pdf_name }) {
  const [pdf, setPdf] = useState(null);
  const canvasRef = useRef(null);
  const url = `${API_URL}/pdfs/${pdf_name}`;

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);

        // Render first page
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    fetchPdf();
  }, [url]);

  return (
    <div className="pdf-viewer">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default PdfView;
