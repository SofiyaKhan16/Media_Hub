import React from "react";
import ImagePreview from "./ImagePreview";
import VideoPreview from "./VideoPreview";
import AudioPreview from "./AudioPreview";
import PdfPreview from "./PdfPreview";

const icons = {
  image: "🖼️",
  video: "🎬",
  audio: "🎵",
  pdf: "📄",
};

function getFileType(file) {
  const name = file.name ? file.name.toLowerCase() : '';
  if (file.type?.startsWith("image/") || [".png", ".jpg", ".jpeg", ".gif", ".webp"].some(ext => name.endsWith(ext))) return "image";
  if (file.type?.startsWith("video/") || [".mp4", ".mov", ".avi", ".wmv"].some(ext => name.endsWith(ext))) return "video";
  if (file.type?.startsWith("audio/") || [".mp3", ".wav", ".ogg", ".m4a"].some(ext => name.endsWith(ext))) return "audio";
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  return "unknown";
}

export default function FilePreview({ file, preview }) {
  const type = getFileType(file);
  if (type === "image" && preview) return <ImagePreview src={preview} alt={file.name} />;
  if (type === "video" && preview) return <VideoPreview src={preview} />;
  if (type === "audio") return <AudioPreview src={preview} />;
  if (type === "pdf" && preview) return <PdfPreview src={preview} title={`PDF Preview: ${file.name}`} />;
  return (
    <div className="file-icon-bg">
      <span className="file-icon">{icons[type] || "📁"}</span>
    </div>
  );
}
