import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Set the workerSrc to use Mozilla's hosted version
pdfjsLib.GlobalWorkerOptions.workerSrc = "../../public/pdf.worker.js";

const PdfView = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(
      (pdf) => {
        pdf.getPage(1).then((page) => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
        });
      },
      (reason) => {
        console.error(reason);
      }
    );
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default PdfView;
