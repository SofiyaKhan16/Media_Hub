import React from "react";

export default function ImagePreview({ src, alt }) {
  return <img src={src} alt={alt} className="file-img" />;
}
