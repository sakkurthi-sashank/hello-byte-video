import React, { useState } from "react";

export const VideoPlayer = ({
  video,
}: {
  video: React.RefObject<HTMLVideoElement>;
}) => {
  const [isVideoOff, setVideoOff] = useState(false);
  const [isMuted, setMuted] = useState(true);

  const handleToggleVideo = () => {
    setVideoOff((prev) => !prev);
  };

  const handleToggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <div>
      <video
        playsInline
        muted={isMuted}
        ref={video}
        autoPlay
        style={{ width: "300px", display: isVideoOff ? "none" : "block" }}
      />
      <div>
        <button onClick={handleToggleVideo}>
          {isVideoOff ? "Turn Video On" : "Turn Video Off"}
        </button>
        <button onClick={handleToggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
};
