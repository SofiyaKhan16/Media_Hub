import React from "react";

export default function AudioPreview({ src }) {
  return (
    <div className="audio-wrap">
      <div className="file-icon">🎵</div>
      {src ? (
        <audio src={src} controls preload="metadata" className="audio-element">
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="no-preview">Audio preview not available</div>
      )}
    </div>
  );
}
