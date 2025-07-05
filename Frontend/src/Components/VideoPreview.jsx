import React from "react";

export default function VideoPreview({ src }) {
  return (
    <video
      src={src}
      controls
      className="video-element"
    >
      Your browser does not support the video tag.
    </video>
  );
}
