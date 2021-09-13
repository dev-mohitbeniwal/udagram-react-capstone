import React from "react";
import VideoPlayer from "react-video-js-player";

const VideoApp = (props) => {
  return (
    <div>
      <VideoPlayer controls={true} src={props.url} />
    </div>
  );
};
export default VideoApp;
