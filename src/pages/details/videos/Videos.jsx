import React, { useState } from "react";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
import Img from "../../../component/lazyLoadlmage/img";
import VideoPopup from "../../../component/videoPopup/VideoPopup";
import "./videos.scss";

const Videos = ({ data = [] }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);
  if (!data?.length) return null;
  return (
    <div className="videosSection">
      <ContentWrapper>
        <h3 className="sectionHeading">Videos</h3>
        <div className="videos">
          {data.slice(0, 8).map((v) => (
            <div
              className="videoItem"
              key={v.id}
              onClick={() => {
                setVideoId(v.key);
                setShow(true);
              }}
            >
              <div className="thumb">
                <Img
                  src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
                />
              </div>
              <div className="title">{v.name}</div>
            </div>
          ))}
        </div>
      </ContentWrapper>
      <VideoPopup
        show={show}
        setShow={setShow}
        videoId={videoId}
        setVideoId={setVideoId}
      />
    </div>
  );
};

export default Videos;
