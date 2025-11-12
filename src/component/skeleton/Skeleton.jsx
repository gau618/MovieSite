import React from "react";

// Minimal skeleton block using global .skeleton shimmer styles
const Skeleton = ({ className = "", style }) => {
  return <div className={`skeleton ${className}`.trim()} style={style} />;
};

export default Skeleton;
