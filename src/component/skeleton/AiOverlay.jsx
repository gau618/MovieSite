import React from "react";
import "./AiOverlay.scss";
import Skeleton from "./Skeleton";

const AiOverlay = ({ visible, message = "Working on it..." }) => {
  if (!visible) return null;
  return (
    <div className="ai-overlay">
      <div className="ai-overlay__backdrop" />
      <div className="ai-overlay__content">
        <div className="ai-overlay__header">
          <span className="ai-overlay__title">Natural search</span>
          <span className="ai-overlay__msg">{message}</span>
        </div>
        <div className="ai-overlay__hero">
          <Skeleton className="ai-overlay__hero-skel" />
        </div>
        <div className="ai-overlay__cards">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ai-overlay__card">
              <Skeleton className="ai-overlay__poster" />
              <Skeleton className="ai-overlay__line" />
              <Skeleton className="ai-overlay__line short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiOverlay;
