import React from "react";

export default function PdfPreview({ src, title }) {
  const isCloudinaryRaw = src && src.includes('/raw/upload/');
  if (isCloudinaryRaw) {
    return (
      <div className="pdf-preview-container">
        <a href={src} download target="_blank" rel="noopener noreferrer" className="pdf-download-link">
          <span className="pdf-icon">📄</span>
          <span className="pdf-text">Download PDF</span>
        </a>
      </div>
    );
  }
  return (
    <iframe
      src={src}
      className="pdf-iframe"
      title={title}
    >
      <p>Your browser does not support PDF preview. <a href={src} target="_blank" rel="noopener noreferrer">Click here to view the PDF</a></p>
    </iframe>
  );
}
